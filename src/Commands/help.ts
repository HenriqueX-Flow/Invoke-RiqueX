import { ICommand } from "../Common/types";
import { Bot } from "../Common/bot";
import fs from "fs";

const Help: ICommand = {
  name: "help",
  description: "Mostra A Lista De Comandos",
  category: "general",
  async run(ctx, msg) {
    const jid = msg.key.remoteJid!;
    const bot = (ctx as any).bot as Bot;

    const grouped: Record<string, ICommand[]> = {};
    for (const cmd of new Set(bot.commands.values())) {
      if (!grouped[cmd.category]) grouped[cmd.category] = [];
    grouped[cmd.category].push(cmd);
    }

    let helpText = "Lista De Comandos:\n\n";
    for (const category of Object.keys(grouped)) {
      helpText += `*${category.toUpperCase()}*\n`;
      for (const cmd of grouped[category]) {
        const aliasText = cmd.aliases ? ` (aliases: ${cmd.aliases.map(a => ":" + a).join(", ")})` : "";
        helpText = `• :${cmd.name}${aliasText} - ${cmd.description}\n`
      }
      helpText += "\n";
    }

    await ctx.sock.sendMessage(jid, {
      document: fs.readFileSync("./media/menu.pdf"),
      fileName: "Invoke RiqueX",
      mimetype: "application/pdf",
      //@ts-ignore
      fileLength: "2450000000",
      pageCount: "245",
      caption: helpText,
      contextInfo: {
        mentionedJid: ["558888205721@s.whatsapp.net"],
        forwardingScore: 245,
        isForwarded: true,
        forwardedAiBotMessageInfo: {
          botName: "Invoke RiqueX",
          botJid: "558896110835@s.whatsapp.net",
          creatorName: "HenriqueX-Flow"
        },
        externalAdReply: {
          title: "Invoke RiqueX",
          body: "© HenriqueX",
          showAdAttribution: null,
          thumbnailUrl: "https://files.catbox.moe/y12axo.png",
          mediaType: 1,
          //@ts-ignore
          previewType: 0,
          renderLargerThumbnail: true,
          mediaUrl: "https://github.com/HenriqueX-Flow",
          sourceApp: "https://github.com/HenriqueX-Flow",
          sourceUrl: "https://github.com/HenriqueX-Flow",
          originalImageUrl: "https://files.catbox.moe/y12axo.png",
          clickToWhatsappCall: true
        }
      }
    }, { quoted: msg });
  }
}

export default Help;
