import { TypedEventEmmiter } from "./events";
import pino from "pino";
import qrcode from "qrcode-terminal";
import { Boom } from "@hapi/boom";
import { loadCommands } from "./commands";
import { IBotContext, IBotEvents } from "./interface";
import { config } from "../config";
import makeWASocket, {
  Browsers,
  DisconnectReason,
  useMultiFileAuthState
} from "baileys-mod";
import { exec } from "child_process";
import { Colors, Consolefy } from "@mengkodingan/consolefy";
import { ConfigManager } from "./utils/config";

const consolefy = new Consolefy({
  prefixes: { 
    info: "Invoke RiqueX",
    error: "Invoke RiqueX",
    warn: "Invoke RiqueX",
    success: "Invoke RiqueX",
  },
  theme: { 
    info: (text) => Colors.bgBlue(Colors.black(text)),
    error: (text) => Colors.bgRed(Colors.black(text)),
    warn: (text) => Colors.bgYellow(Colors.black(text)),
    success: (text) => Colors.bgGreen(Colors.black(text))
  },
  format: "{prefix}{tag} {message}",
  tag: "HenriqueX",
});

export class InvokeRiqueX extends TypedEventEmmiter<IBotEvents> {
  ctx!: IBotContext;
  commands = loadCommands();
  prefix = config.prefix;
  settings: ConfigManager;

  constructor() {
    super();
    this.settings = new ConfigManager();
  }

  async start() {
    const { state, saveCreds } = await useMultiFileAuthState("state");

    const socket = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      logger: pino({ level: "silent" }),
      browser: Browsers.ubuntu("Firefox"),
      markOnlineOnConnect: true,
    });

    this.ctx = { socket };

    // Mensagens
    socket.ev.on("messages.upsert", ({ messages }) => {
      this.emit("message", { ctx: this.ctx, msg: messages[0] });
    });

    // Atualização de conexão
    socket.ev.on("connection.update", async (update) => {
      const { qr, connection, lastDisconnect } = update;
      if ((connection === "connecting" && config.connectionMethod === "code" && !socket.authState.creds.registered)) {
        setTimeout(async () => {
          let code = await socket.requestPairingCode(config.phoneNumber, "X245X245");
          console.log(code);
          consolefy.info("Seu Código De Pareamento:" + code);
        }, 3000);
      }
      if (connection === "close") {
        const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        if (reason === DisconnectReason.connectionLost) {
          consolefy.warn("Conexão Perdida Tentando Reconectar...");
          this.start()
        } else if (reason === DisconnectReason.connectionClosed) {
          consolefy.warn("Conexão Fechada Tentando Reconectar..");
          this.start();
        } else if (reason === DisconnectReason.restartRequired) {
          consolefy.info("Reinicando...");
          this.start();
        } else if (reason === DisconnectReason.timedOut) {
          consolefy.warn("Tempo De Conexão Esgotado, Tentando Reconectar...");
          this.start();
        } else if (reason === DisconnectReason.badSession) {
          consolefy.error("Problemas Com A Sessão.");
          this.start();
        } else if (reason === DisconnectReason.connectionReplaced) {
          console.error("Delete O Arquivo 'state' E Reconecte");
        } else if (reason === DisconnectReason.loggedOut) {
          console.error("Desgonectado, Reconecte Novamente.");
          exec("rm -rf ./state/*");
        }
      }

      this.emit("connection", { ctx: this.ctx, status: connection! });
    });

    // Eventos de grupo
    socket.ev.on("group-participants.update", ({ id, action }) => {
      this.emit("group", { ctx: this.ctx, action, jid: id });
    });

    // Salvar credenciais
    socket.ev.on("creds.update", saveCreds);
  }
}
