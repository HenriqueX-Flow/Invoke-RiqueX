import makeWASocket, { useMultiFileAuthState } from "baileys";
import { TypedEventEmitter } from "./events";
import { BotEvents, BotContext } from "./types";
import { loadCommands } from "./commands";
import { MiddlewareManager } from "./middleware";
import QR from "qrcode-terminal";

export class Bot extends TypedEventEmitter<BotEvents> {
  ctx!: BotContext;
  commands = loadCommands();
  middlewares = new MiddlewareManager();
  prefix = ":";

  async start() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");
    const sock = makeWASocket({ auth: state, printQRInTerminal: false });

    this.ctx = { sock };

    sock.ev.on("messages.upsert", ({ messages }) => {
      this.emit("message", { ctx: this.ctx, msg: messages[0] });
    });

    sock.ev.on("connection.update", (update) => {
      const { qr, connection } = update;
      if (qr) {
        QR.generate(qr, { small: true });
      }
      this.emit("connection", { ctx: this.ctx, status: update.connection! });
    });

    sock.ev.on("group-participants.update", ({ id, action }) => {
      this.emit("group", { ctx: this.ctx, action, jid: id });
    });

    sock.ev.on("creds.update", saveCreds);
  }
}
