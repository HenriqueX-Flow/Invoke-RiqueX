import fs from "fs";
import path from "path";
import { Colors, Consolefy } from "@mengkodingan/consolefy";
import { InvokeRiqueX } from "../bot";

export default function register(bot: InvokeRiqueX) {
  bot.on("message", async ({ ctx, msg }) => {
    if (!msg.message) return;

    const typesMsg =
      msg.message.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption ||
      "";
    if (!typesMsg.startsWith(bot.prefix)) return;

    const text =
      msg.message.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption ||
      "";

    const type = Object.keys(msg.message)[0] || "desconhecido";

    const sender = msg.key.participant || msg.key.remoteJid || "desconhecido";
    const jid = msg.key.remoteJid || "";
    const user = sender.replace(/@s\.whatsapp\.net$/, "");

    let groupName = "";
    if (jid.endsWith("@g.us")) {
      try {
        const metadata = await ctx.socket.groupMetadata(jid);
        groupName = metadata?.subject || "Grupo sem nome";
      } catch {
        groupName = "Grupo (não consegui pegar o nome)";
      }
    }

    const consolefy = new Consolefy({
      prefixes: { info: "EVENTO" },
      theme: { info: (text) => Colors.bgMagenta(Colors.black(text)) },
      format: "{prefix}{tag} {message}",
      tag: type.toUpperCase(),
    });

    const interfaceConsole = `╭──❍「 NOVA MENSAGEM 」❍
│ Conteúdo: ${text || "(sem texto)"}
│ Local: ${jid.endsWith("@g.us") ? `Mensagem No Grupo: ${groupName}` : "Mensagem No PV"}
│ Enviada Por: ${sender}
╰──────❍`;

    consolefy.info(`${user}: ${text || "(sem texto)"}`);
    console.log(interfaceConsole);

    // 🔥 Checa se é comando
    if (!text.startsWith(bot.prefix)) return;

    const args = text.slice(bot.prefix.length).trim().split(/ +/);
    const cmdName = args.shift()?.toLowerCase();
    if (!cmdName) return;

    // Executa comando
    const cmd = bot.commands.get(cmdName);
    if (cmd) {
      try {
        (ctx as any).bot = bot;
        await cmd.execute(ctx, msg, args);
      } catch (e) {
        console.error("Erro Ao Executar Comando:", e);
      }
    }
  });
}

