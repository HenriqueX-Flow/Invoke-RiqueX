import { InvokeRiqueX } from "../bot";
import { Consolefy } from "@mengkodingan/consolefy";

const consolefy = new Consolefy();

export default function register(bot: InvokeRiqueX) {
  bot.on("connection", ({ status }) => {
    const text = `Status Da Conexão: ${status || "Desconhecido"}`
    console.log(text);
  });

  bot.on("group", ({ action, jid }) => {
    const text = `Evento Do Grupo: ${action} Em ${jid}`;
    console.log(text);
  });

  bot.on("message", async ({ ctx, msg }) => {
    if (!msg.message)
      return;

    const text = msg.message.conversation || msg.message?.extendedTextMessage?.text;
    const type = Object.keys(msg.message)[0] || "Desconhecido";
    const sender = msg.key.participant || msg.key.remoteJid || "Desconhecido";
    const jid = msg.key.remoteJid || "";
    const user = sender.replace(/@s\.whatsapp\.net$/, "");

    let groupName = "";
    if (jid.endsWith("@g.us")) {
      try {
        const metadata = await ctx.socket.groupMetadata(jid);
        groupName = metadata?.subject || "Desconhecido";
      } catch {
        groupName = "Desconhecido";
      }
    }

    const interfaceConsole = `╭──❍「 NOVA MENSAGEM 」❍
│ Conteúdo: ${text || "(sem texto)"}
│ Local: ${jid.endsWith("@g.us") ? `Mensagem No Grupo: ${groupName}` : "Mensagem No PV"}
│ Enviada Por: ${sender}
╰──────❍`;

console.log(`${user}: ${text || "Sem Texto"}`);
console.log(interfaceConsole);

if (!text?.startsWith(bot.prefix))
  return;

const args = text.slice(bot.prefix.length).trim().split(/ +/);
const cmdName = args.shift()?.toLowerCase();

if (!cmdName)
  return;

const cmd = bot.commands.get(cmdName);
if (cmd) {
  try {
    (ctx as any).bot = bot;
    await cmd.execute(ctx, msg, args);
  } catch (e) {
    console.log(e);
  }
}
  })
}
