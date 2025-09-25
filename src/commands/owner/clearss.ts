import fs from "fs";
import path from "path";
import { ICommand } from "../../common/interface";
import { isOwner, sendReply } from "../../common/utils/message";

const sessionsTypes: ICommand = {
  name: "session",
  help: "(opção)",
  category: "criador",
  aliases: ["sessao"],
  usage: ":session info = Informações Da Sessão, :session delete = Apaga Arquivos Inúteis, :session logout = Remover Sessão",
  async execute(ctx, msg, args) {
    const jid = msg.key.remoteJid!;
    const options = args?.join(" ");

    if (!isOwner(msg)) {
      await sendReply(ctx, "Comando Exclusivo Para O Criador.", msg);
      return;
    }
 
    if (options === "delete") {
      fs.readdir("./state", async (err, files) => {
        if (err) {
          console.error("Erro Ao analisar O Diretório: " + err);
          return sendReply(ctx, "correu Um Erro Ao Ler A Pasta.", msg);
        }

        const filteredArray = files.filter(item =>
          ["session-", "pre-key", "app-state"].some(ext => item.startsWith(ext))
        );

        let text = `Detectados *${filteredArray.length}* Arquivos Inúteis De Sessão.\n\n`;
        if (filteredArray.length === 0)
          return await sendReply(ctx, text, msg);

        filteredArray.forEach((e, i) => text += `${i + 1}. ${e}\n`);

        await sendReply(ctx, text + "\nLimpando Em 9s...", msg);

        setTimeout(() => {
          filteredArray.forEach(file => fs.unlinkSync("./state/" + file));
          ctx.socket.sendMessage(jid, { text: "Toda A Lixeira Da Sessão Foi Excluída Com Sucesso." });
        }, 9000);
      });

    } else if (options === "info") {
      try {
        const files = fs.readdirSync("./state");
        if (files.length === 0) return sendReply(ctx, "A Pasta De Sessão Está Vazia.", msg);

        let totalSize = 0;
        let biggest = { name: "", size: 0 };
        let smallest = { name: "", size: Infinity };

        for (const file of files) {
          const filePath = path.join("./state", file);
          const stats = fs.statSync(filePath);
          const size = stats.size;

          totalSize += size;
          if (size > biggest.size) biggest = { name: file, size };
          if (size < smallest.size) smallest = { name: file, size };
        }

        const formatBytes = (bytes: number) => {
          const sizes = ["B", "KB", "MB", "GB"];
          if (bytes === 0) return "0 B";
          const i = Math.floor(Math.log(bytes) / Math.log(1024));
          return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
        };

        const text = `📊 *Informações da Sessão* 📊\n\n` +
          `📂 Arquivos: *${files.length}*\n` +
          `💾 Tamanho Total: *${formatBytes(totalSize)}*\n\n` +
          `📈 Maior Arquivo: *${biggest.name}* (${formatBytes(biggest.size)})\n` +
          `📉 Menor Arquivo: *${smallest.name}* (${formatBytes(smallest.size)})`;

        await sendReply(ctx, text, msg);

      } catch (e) {
        console.error(e);
        await sendReply(ctx, "Erro Ao Coletar Informações Da Sessão.", msg);
      }

    } else if (options === "logout") {
      try {
        fs.rmSync("./state", { recursive: true, force: true });
        await sendReply(ctx, "Sessão Removida. O Bot Será Desconectado.", msg);
        process.exit(0);
      } catch (e) {
        console.error(e);
        await sendReply(ctx, "Erro Ao Tentar Remover A Sessão.", msg);
      }
    } else {
      const buttons = [
      { buttonId: ":session info", buttonText: { displayText: "Info Sessão" }, type: 1 },
      { buttonId: ":session delete", buttonText: { displayText: "Deletar Arquivos" }, type: 1 },
      { buttonId: ":session logout", buttonText: { displayText: "Desconectar" }, type: 1 }
    ];

    await ctx.socket.sendMessage(jid, {
      document: fs.readFileSync("./state/creds.json"),
      caption: `*Escolha Uma Opção Criador*

╭──❍「 *botões* 」❍
├ *Info Sessão:* Mostrar Informações
├ *Deletar Arquivos:* Remove Arquivos Inúteis, Mas Mantém A Sessão.
├ *Desconectar:* Remove A Sessão Completa E Derruba O Bot.
╰─┬────❍
╭─┴─❍「 *comando* 」❍
├ *:session info* — Mostrar Info
├ *:session delete* — Deletar Inúteis
├ *:session logout* — Deslogar
╰─────❍`,
      buttons,
      mimetype: "application/json",
      fileName: "creds.json",
      contextInfo: {
        isForwarded: true,
        externalAdReply: {
          title: "Invoke RiqueX",
          body: "© HenriqueX",
          mediaType: 1,
          renderLargerThumbnail: true,
          thumbnailUrl: "https://files.catbox.moe/d5d2x5.jpg",
        }
      }
    }, { quoted: msg });

    }
  }
};

export default sessionsTypes;
