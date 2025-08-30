import { ICommand } from "../Common/types";
import { Bot } from "../Common/bot";
import fs from "fs";
import moment from "moment-timezone";

// Função para estilizar texto
const Styles = (text: string, style: number = 1): string => {
  const xStr: string[] =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");

  const yStr: Record<number, string> = {
    1: "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
    2: "ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ１２３４５６７８９０",
  };

  type Replacer = { original: string; convert: string };
  const replacer: Replacer[] = [];

  xStr.forEach((v, i) => {
    replacer.push({ original: v, convert: yStr[style]?.[i] ?? v });
  });

  const str = text.split("");
  return str
    .map((v: string) => {
      const found = replacer.find((x) => x.original === v);
      return found ? found.convert : v;
    })
    .join("");
};

async function loadJimp() {
  try {
    // @ts-ignore
    let JimpLib = require("jimp");
    if (JimpLib && JimpLib.default && !JimpLib.read) JimpLib = JimpLib.default;
    return JimpLib;
  } catch (e) {
    try {
      const mod = await import("jimp");
      return (mod as any).default || mod;
    } catch (e2) {
      return null;
    }
  }
}

const day = moment.tz("America/Fortaleza").locale("pt-BR").format("dddd");
const date = moment.tz("America/Fortaleza").locale("pt-BR").format("DD/MM/YYYY");
const hours = moment.tz("America/Fortaleza").locale("pt-BR").format("HH:mm");

const Help: ICommand = {
  name: "help",
  category: "basicos",
  help: "",
  aliases: ["menu", "main"],
  async run(ctx, msg) {
    const jid = msg.key.remoteJid!;
    const sender = msg.key.participant || msg.key.remoteJid!;
    const bot = (ctx as any).bot as Bot;

    const grouped: Record<string, ICommand[]> = {};
    for (const cmd of new Set(bot.commands.values())) {
      if (!grouped[cmd.category]) grouped[cmd.category] = [];
      grouped[cmd.category].push(cmd);
    }
    let helpText = `nome: ${msg.pushName ? msg.pushName : "Sem Nome"}\nmenção: @${sender.split("@")[0]}\n\nhora: ${hours}\ndia: ${day}\ndata: ${date}\n\n`;
    for (const category of Object.keys(grouped)) {
      helpText += `*${category.toUpperCase()}*\n`;
      for (const cmd of grouped[category]) {
        helpText += `• :${cmd.name} - ${cmd.help}\n`;
      }
      helpText += "\n";
    }

    const Jimp = await loadJimp();
    let jpegThumb: Buffer | undefined;
    try {
      let header = await bot.ctx.sock.profilePictureUrl(jid, "image").catch(() => null);
      if (!header) header = "https://files.catbox.moe/y12axo.png";
      if (Jimp && Jimp.read) {
        const headerThumbnail = await Jimp.read(header);
        jpegThumb = await headerThumbnail.resize(100, 100).getBufferAsync(Jimp.MIME_JPEG);
      } else {
        console.warn("Jimp Talvez Não Está Disponível — Vou Enviar Sem jpegThumbnail");
      }
    } catch (err) {
      console.error("Não Conseguir Gerar Imagem Com Jimp:", err);
      jpegThumb = undefined;
    }

    const message: any = {
      document: fs.readFileSync("./media/menu.pdf"),
      fileName: "Invoke RiqueX",
      mimetype: "image/jpeg",
      //@ts-ignore
      fileLength: "245000000",
      caption: Styles(helpText),
      contextInfo: {
        mentionedJid: [sender, "558888205721@s.whatsapp.net"],
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
          mediaType: 1,
          //@ts-ignore
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: "https://files.catbox.moe/y12axo.png",
          mediaUrl: "https://github.com/HenriqueX-Flow",
          sourceUrl: "https://github.com/HenriqueX-Flow",
          originalImageUrl: "https://files.catbox.moe/y12axo.png"
        },
        businessMessageForwardInfo: {
          businessOwnerJid: "558896110835@s.whatsapp.net"
        }
      }
    };

    if (jpegThumb) message.jpegThumbnail = jpegThumb;

    await ctx.sock.sendMessage(jid, message, { quoted: msg });
  }
};

export default Help;
