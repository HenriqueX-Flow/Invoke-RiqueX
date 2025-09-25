import fs from "fs";
import path from "path";
import { Colors, Consolefy } from "@mengkodingan/consolefy";
import { InvokeRiqueX } from "../bot";
import { shouldShowHelp, getCommandIntro } from "../help";
import { sendReply } from "../utils/message";
import { config } from "../../config";
import chalk from "chalk";

const lastResponse: Record<string, number> = {};

function safeReadJson<T>(file: string, fallback: T): T {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
      return fallback;
    }
    const content = fs.readFileSync(file, "utf-8");
    return JSON.parse(content) as T;
  } catch (e) {
    console.error(`Erro Ao Ler JSON ${file}, Recriando...`, e);
    fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
    return fallback;
  }
}

const activeFile = path.join(process.cwd(), "data", "active.json");
safeReadJson(activeFile, { autoresp: false });

const qaFile = path.join(process.cwd(), "data", "qa.json");
safeReadJson(qaFile, {});

const stickerReplies: Record<string, string> = {
  "0ZylIWMUFQHfiudOtk+oQen+/HOsH25CnPrbR517WUY=": "Uuuuu",
};

setInterval(() => {
  const now = Date.now();
  for (const [u, t] of Object.entries(lastResponse)) {
    if (now - t > 60000) delete lastResponse[u];
  }
}, 60000);

export default function register(bot: InvokeRiqueX) {
  bot.on("message", async ({ ctx, msg }) => {
    if (!msg.message) return;

    if (bot.settings.get("autoread")) {
      try {
        await ctx.socket.readMessages([msg.key]);
      } catch (e) {
        console.error(e);
      }
    }

    const type = Object.keys(msg.message)[0] || "Desconhecido";
    const sender = msg.key.participant || msg.key.remoteJid || "";
    const user = sender.replace(/@s\.whatsapp\.net$/, "") || "Desconhecido";
    const jid = msg.key.remoteJid || "";
    let groupName = "";
    if (jid.endsWith("@g.us")) {
      try {
        const metadata = await ctx.socket.groupMetadata(jid);
        groupName = metadata?.subject || "Desconhecido"
      } catch {
        groupName = "Não Conseguir Pegar O Nome Do Grupo.";
      }
    }

    const consolefy = new Consolefy({
      prefixes: { info: "EVENTO" },
      theme: { info: (text) => Colors.bgMagenta(Colors.black(text)) },
      format: "{prefix}{tag} {message}",
      tag: type.toUpperCase(),
    });

    if (!bot.settings.get("publicMode")) {
      const isDev = config.ownerNumber.includes(sender);
      if (!isDev) {
        return;
      }
    }

    /*  const rawLog = JSON.stringify(msg.message, null, 2);
    consolefy.info(
      `${user}: ${rawLog.length > 800 ? rawLog.slice(0, 800) + " ...[TRUNCADO]" : rawLog}`,
    );
    */
 
    const now = Date.now();
    if (lastResponse[user] && now - lastResponse[user] < 3000) return;
    lastResponse[user] = now;

    if (msg.message?.stickerMessage) {
      try {
        const sha = (msg.message.stickerMessage.fileSha256 as any) || null;
        const hash = sha ? Buffer.from(sha).toString("base64") : null;
        consolefy.info(`${user}: Sticker detectado, hash=${hash ?? "null"}`);

        if (hash && stickerReplies[hash]) {
          const menuCmd = bot.commands.get("menu");
          if (menuCmd) {
            try {
              consolefy.info(
                `${user}: Executando comando 'menu' por figurinha`,
              );
              await menuCmd.execute(ctx, msg, [], bot);
            } catch (e) {
              console.error("Erro ao executar menu via sticker:", e);
              await ctx.socket.sendMessage(
                jid,
                { text: stickerReplies[hash] },
                { quoted: msg },
              );
            }
          } else {
            consolefy.info(
              `${user}: Comando 'menu' não encontrado — enviando fallback text`,
            );
            await ctx.socket.sendMessage(
              jid,
              { text: stickerReplies[hash] },
              { quoted: msg },
            );
          }
          return;
        }
      } catch (e) {
        console.error("Erro ao processar figurinha:", e);
      }
    }

    let text =
      msg.message.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption ||
      msg.message?.buttonsResponseMessage?.selectedButtonId ||
      msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
      "";

    if (
      msg.message?.interactiveResponseMessage?.nativeFlowResponseMessage
        ?.paramsJson
    ) {
      try {
        const parsed = JSON.parse(
          msg.message.interactiveResponseMessage.nativeFlowResponseMessage
            .paramsJson,
        );
        text = parsed.id || text;
      } catch (e) {
        console.error("Erro ao parsear paramsJson:", e);
      }
    }
    if (!text) return;

  if (msg) {
      consolefy.info(`${user}: ${text || "Sem Texto"}`);
      const line = (str: string) => console.log(chalk.underline(str));
      console.log(`${line("X")}`);
    }

    if (text.trim().toLowerCase() === "menu") return;

    if (text.startsWith(bot.prefix)) {
      const args = text.slice(bot.prefix.length).trim().split(/ +/);
      const cmdName = args.shift()?.toLowerCase();
      if (!cmdName) return;

      const cmd = bot.commands.get(cmdName);
      if (cmd) {
        try {
          (ctx as any).bot = bot;
          if (bot.settings.get("autotyping"))
            await ctx.socket.sendPresenceUpdate("composing", jid);
          await cmd.execute(ctx, msg, args, bot);
          await ctx.socket.sendPresenceUpdate("paused", jid);

          if (cmd.intro && shouldShowHelp(user, cmd)) {
            const intro = getCommandIntro(cmd);
            await ctx.socket.sendMessage(jid, { text: intro }, { quoted: msg });
          }
        } catch (e) {
          await sendReply(
            ctx,
            "Ocorreu Um Erro No Sistema. Pedimos Desculpas Pelo Inconveniente. Este Erro Está Sendo Enviado Para O Desenvolvedor.",
            msg,
          );
          console.error("Erro Ao Executar Comando:", e);
          const dev = config.ownerNumber[0];
          setTimeout(async () => {
            await ctx.socket.sendMessage(dev, {
              text:
                `Olá Dev, após o usuário: @${sender.split("@")[0]} usar o comando: *${bot.prefix}${cmd.name}* ocorreu um erro:\n\n` +
                "```" +
                e +
                "```",
              mentions: [sender],
            });
          }, 8000);
        }
      }
      return;
    }

    try {
      const active = safeReadJson(activeFile, { autoresp: false });
      if (active.autoresp) {
        const qa = safeReadJson<Record<string, string>>(qaFile, {});
        const reply = qa[text.toLowerCase()];
        if (reply) {
          await ctx.socket.sendMessage(jid, { text: reply }, { quoted: msg });
        }
      }
    } catch (e) {
      console.error("Erro no sistema de auto resposta:", e);
    }
  });
}
