import { TypedEventEmmiter } from "./events";
import pino from "pino";
import qrcode from "qrcode-terminal";
import { loadCommands } from "./commands";
import { IBotContext, IBotEvents } from "./interface";
import { config } from "../config";
import makeWASocket, { Browsers, DisconnectReason, useMultiFileAuthState } from "baileys";

export class InvokeRiqueX extends TypedEventEmmiter < IBotEvents > {
	ctx!: IBotContext;
	commands = loadCommands();
	prefix = config.prefix;

	constructor() {
		super()
	}

	async start() {
		const {
			state,
			saveCreds
		} = await useMultiFileAuthState("state");

		const socket = makeWASocket({
			auth: state,
			printQRInTerminal: false,
			logger: pino({
				level: "silent"
			}),
			browser: Browsers.ubuntu("Firefox"),
		});

		this.ctx = {
			socket
		};

		socket.ev.on("messages.upsert", ({
			messages
		}) => {
			this.emit("message", {
				ctx: this.ctx,
				msg: messages[0]
			});
		});

		socket.ev.on("connection.update", (u) => {
			const {
				qr,
				connection,
				lastDisconnect
			} = u;
			if (qr) {
				qrcode.generate(qr, {
					small: true
				});
			}
			if (connection === "close") {
				const reason = (lastDisconnect?.error as any)?.ouput?.statusCode;
				if (reason !== DisconnectReason.loggedOut) {
					console.log("RECONECTANDO..");
					this.start().catch(console.error)
				} else if (reason !== DisconnectReason.connectionClosed) {
					console.log("TENTANDO RECONECTAR...");
					this.start().catch(console.error);
				} else if (reason !== DisconnectReason.restartRequired) {
					console.log("Reiniciando");
				} else {
					console.log("Ouve Uma Queda Desconhecida");
				}
			}
			this.emit("connection", {
				ctx: this.ctx,
				status: u.connection!
			});
		});

		socket.ev.on("group-participants.update", ({
			id,
			action
		}) => {
			this.emit("group", {
				ctx: this.ctx,
				action,
				jid: id
			});
		});

		socket.ev.on("creds.update", saveCreds);
	}
};
