"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const baileys_1 = __importStar(require("baileys"));
const events_1 = require("./events");
const commands_1 = require("./commands");
const middleware_1 = require("./middleware");
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const pino_1 = __importDefault(require("pino"));
const consolefy_1 = require("@mengkodingan/consolefy");
const consolefy = new consolefy_1.Consolefy();
class Bot extends events_1.TypedEventEmitter {
    constructor() {
        super(...arguments);
        this.commands = (0, commands_1.loadCommands)();
        this.middlewares = new middleware_1.MiddlewareManager();
        this.prefix = ":";
    }
    async start() {
        const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)("auth");
        const sock = (0, baileys_1.default)({
            auth: state,
            printQRInTerminal: false,
            logger: (0, pino_1.default)({ level: "silent" })
        });
        this.ctx = { sock };
        sock.ev.on("messages.upsert", ({ messages }) => {
            this.emit("message", { ctx: this.ctx, msg: messages[0] });
        });
        sock.ev.on("connection.update", (update) => {
            const { qr, connection, lastDisconnect } = update;
            if (qr) {
                qrcode_terminal_1.default.generate(qr, { small: true });
            }
            if (connection === "close") {
                const reason = lastDisconnect?.error?.output?.statusCode;
                if (reason !== baileys_1.DisconnectReason.loggedOut) {
                    consolefy.warn("Reconectando...");
                    this.start().catch(console.error);
                }
                else if (reason !== baileys_1.DisconnectReason.connectionClosed) {
                    consolefy.log("Tentando Reconectar");
                    this.start().catch(console.error);
                }
                else if (reason !== baileys_1.DisconnectReason.restartRequired) {
                    consolefy.warn("Reiniciando...");
                    this.start().catch(console.error);
                }
                else if (reason !== baileys_1.DisconnectReason.connectionLost) {
                    consolefy.log("Tentando Reconectar");
                    this.start().catch(console.error);
                }
                else if (reason !== baileys_1.DisconnectReason.timedOut) {
                    consolefy.log("Tentando Reconectar");
                    this.start().catch(console.error);
                }
                else {
                    consolefy.log("Sessão Encerrada");
                }
            }
            this.emit("connection", { ctx: this.ctx, status: update.connection });
        });
        sock.ev.on("group-participants.update", ({ id, action }) => {
            this.emit("group", { ctx: this.ctx, action, jid: id });
        });
        sock.ev.on("creds.update", saveCreds);
    }
}
exports.Bot = Bot;
