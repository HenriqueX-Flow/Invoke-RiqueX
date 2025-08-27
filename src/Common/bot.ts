import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "baileys";
import { TypedEventEmitter } from "./events";
import { BotEvents, BotContext } from "./types";
import { loadCommands } from "./commands";
import { MiddlewareManager } from "./middleware";
import QR from "qrcode-terminal";
import pino from "pino";
import { Consolefy } from "@mengkodingan/consolefy";

const consolefy = new Consolefy();

export class Bot extends TypedEventEmitter<BotEvents> {
  ctx!: BotContext;
  commands = loadCommands();
  middlewares = new MiddlewareManager();
  prefix = ":";

  async start() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");
    const sock = makeWASocket({ 
      auth: state, 
      printQRInTerminal: false,
      logger: pino({ level: "silent" })
    });

    this.ctx = { sock };

    sock.ev.on("messages.upsert", ({ messages }) => {
      this.emit("message", { ctx: this.ctx, msg: messages[0] });
    });

    sock.ev.on("connection.update", (update) => {
      const { qr, connection, lastDisconnect } = update;
      if (qr) {
        QR.generate(qr, { small: true });
      }
      if (connection === "close") {
        const reason = (lastDisconnect?.error as any)?.output?.statusCode;
        if (reason !== DisconnectReason.loggedOut) {
          consolefy.warn("Reconectando...");
          this.start().catch(console.error);
        } else if (reason !== DisconnectReason.connectionClosed) {
          consolefy.log("Tentando Reconectar")
          this.start().catch(console.error);
        } else if (reason !== DisconnectReason.restartRequired) {
          consolefy.warn("Reiniciando...");
          this.start().catch(console.error);
        } else if (reason !== DisconnectReason.connectionLost) {
          consolefy.log("Tentando Reconectar");
          this.start().catch(console.error);
        } else if (reason !== DisconnectReason.timedOut) {
          consolefy.log("Tentando Reconectar");
          this.start().catch(console.error);
        } else {
          consolefy.log("Sessão Encerrada");
        }
      }
      this.emit("connection", { ctx: this.ctx, status: update.connection! });
    });

    sock.ev.on("group-participants.update", ({ id, action }) => {
      this.emit("group", { ctx: this.ctx, action, jid: id });
    });

    sock.ev.on("creds.update", saveCreds);
  }
}
