import fs from "fs";
import path from "path";
import { Colors, Consolefy } from "@mengkodingan/consolefy";
import { InvokeRiqueX } from "../bot";
import { shouldShowHelp, getCommandIntro } from "../help";
import { sendReply } from "../utils/message";
import { config } from "../../config";

/* FLOOD CONTROL "Mapa De Últimos Tempos De Resposta Por Usuário" */
const lastResponse: Record<string, number> = {};

/* Função segura para ler JSON */
function safeReadJson<T>(file: string, fallback: T): T {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
      return fallback;
    }
    const content = fs.readFileSync(file, "utf-8");
    return JSON.parse(content) as T;
  } catch (e) {
    console.error(`⚠️ Erro ao ler JSON ${file}, recriando...`, e);
    fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
    return fallback;
  }
}

/* Caminho Do JSON De Auto-Resposta */
const activeFile = path.join(process.cwd(), "data", "active.json");
safeReadJson(activeFile, { autoresp: false });

/* Caminho Do JSON De Perguntas E Respostas */
const qaFile = path.join(process.cwd(), "data", "qa.json");
safeReadJson(qaFile, {});

/* Respostas Para Stickers */
const stickerReplies: Record<string, string> = {
  "0ZylIWMUFQHfiudOtk+oQen+/HOsH25CnPrbR517WUY=": "Conheço Essa Figurinha 👀",
};

/* Limpeza periódica do anti-flood */
setInterval(() => {
  const now = Date.now();
  for (const [u, t] of Object.entries(lastResponse)) {
    if (now - t > 60000) delete lastResponse[u]; // remove se passou 1min
  }
}, 60000);

export default function register(bot: InvokeRiqueX) {
  bot.on("message", async ({ ctx, msg }) => {
    if (!msg.message) return;

    const type = Object.keys(msg.message)[0] || "desconhecido";
    const sender = msg.key.participant || msg.key.remoteJid || "";
    const user = (sender.replace(/@s\.whatsapp\.net$/, "") || "Desconhecido");
    const jid = msg.key.remoteJid || "";

    const consolefy = new Consolefy({
      prefixes: { info: "EVENTO" },
      theme: { info: (text) => Colors.bgMagenta(Colors.black(text)) },
      format: "{prefix}{tag} {message}",
      tag: type.toUpperCase(),
    });

    // 📌 log (limitado para não travar)
    const rawLog = JSON.stringify(msg.message, null, 2);
    consolefy.info(`${user}: ${rawLog.length > 800 ? rawLog.slice(0, 800) + " ...[TRUNCADO]" : rawLog}`);

    // 🚫 anti-flood (mínimo 3s entre respostas para o mesmo user)
    const now = Date.now();
    if (lastResponse[user] && now - lastResponse[user] < 3000) return;
    lastResponse[user] = now;

    // ============================
    // 📌 0) Tratamento de FIGURINHA
    // Deve estar aqui (antes de checar texto/prefixo), para responder quando o usuário enviar só a figurinha.
    // ============================
    if (msg.message?.stickerMessage) {
      try {
        const sha = (msg.message.stickerMessage.fileSha256 as any) || null;
        const hash = sha ? Buffer.from(sha).toString("base64") : null;
        consolefy.info(`${user}: Sticker detectado, hash=${hash ?? "null"}`);

        if (hash && stickerReplies[hash]) {
          // tenta executar o comando 'menu' se existir
          const menuCmd = bot.commands.get("menu");
          if (menuCmd) {
            try {
              consolefy.info(`${user}: Executando comando 'menu' por figurinha`);
              await menuCmd.execute(ctx, msg, [], bot);
            } catch (e) {
              console.error("Erro ao executar menu via sticker:", e);
              // fallback: envia texto simples
              await ctx.socket.sendMessage(jid, { text: stickerReplies[hash] }, { quoted: msg });
            }
          } else {
            // fallback: se não existe comando 'menu', envia a resposta cadastrado no stickerReplies
            consolefy.info(`${user}: Comando 'menu' não encontrado — enviando fallback text`);
            await ctx.socket.sendMessage(jid, { text: stickerReplies[hash] }, { quoted: msg });
          }
          return; // já tratamos a figurinha — sair
        }
      } catch (e) {
        console.error("Erro ao processar figurinha:", e);
        // não interrompe o fluxo — continua para possível auto-resposta/texto
      }
    }

    // 📌 pega texto de qualquer tipo de mensagem
    const text =
      msg.message.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption ||
      "";

    if (!text) return;

    // 📌 2) Ignorar "menu" sem prefixo
    if (text.trim().toLowerCase() === "menu") return;

    // 📌 3) Comandos com prefixo
    if (text.startsWith(bot.prefix)) {
      const args = text.slice(bot.prefix.length).trim().split(/ +/);
      const cmdName = args.shift()?.toLowerCase();
      if (!cmdName) return;

      const cmd = bot.commands.get(cmdName);
      if (cmd) {
        try {
          (ctx as any).bot = bot;
          await cmd.execute(ctx, msg, args, bot);

          if (cmd.intro && shouldShowHelp(user, cmd)) {
            const intro = getCommandIntro(cmd);
            await ctx.socket.sendMessage(jid, { text: intro }, { quoted: msg });
          }
        } catch (e) {
          await sendReply(
            ctx,
            "Ocorreu Um Erro No Sistema. Pedimos Desculpas Pelo Inconveniente. Este Erro Está Sendo Enviado Para O Desenvolvedor.",
            msg
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

    // 📌 4) Auto resposta (se ativado)
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