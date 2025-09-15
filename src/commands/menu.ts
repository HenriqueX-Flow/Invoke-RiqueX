import { ICommand } from "../common/interface";
import { InvokeRiqueX } from "../common/bot";
import { config, generate, reSize } from "../config";
import moment from "moment-timezone";
import { getRandom, sendReply } from "../common/utils/message";

const styles = (text: string, style: number = 1): string => {
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

const day = moment.tz("America/Fortaleza").locale("pt-BR").format("dddd");
const date = moment
  .tz("America/Fortaleza")
  .locale("pt-BR")
  .format("DD/MM/YYYY");
const hours = moment.tz("America/Fortaleza").locale("pt-BR").format("HH:mm");
const ownerJid = config.ownerNumber[0];
const ownerMention = "@" + ownerJid.split("@")[0];

const menu: ICommand = {
  name: "menu",
  category: "basicos",
  aliases: ["main"],
  async execute(ctx, msg, args, bot) {
    const jid = msg.key.remoteJid!;
    const sender = msg.key.participant || msg.key.remoteJid!;
    const name = msg.pushName || "Sem Nome";

    const grouped: Record<string, ICommand[]> = {};
    for (const cmd of new Set(bot.commands.values())) {
      if (!grouped[cmd.category]) grouped[cmd.category] = [];
      grouped[cmd.category].push(cmd);
    }

    const setv = getRandom(config.listv);
    const getRandomReact = getRandom(config.reacts);

    let helpText = `╭──❍「 *usuário* 」❍
├ *nome :* ${name.toLowerCase()}
├ *menção :* @${sender.split("@")[0]}
╰─┬────❍
╭─┴─❍「 *bot* 」❍
├ *bot :* ${config.botName.toLowerCase()}
├ *powered :* @${"0@s.whatsapp.net".split("@")[0]}
├ *criador :* ${ownerMention}
╰─┬────❍
╭─┴─❍「 *tempo* 」❍
├ *hora :* ${hours}
├ *dia :* ${day}
├ *data :* ${date}
╰──────❍\n`;

    const categories = Object.keys(grouped);

    categories.forEach((category, catIndex) => {
      if (catIndex === 0) {
        helpText += `\n╭──❍「 *${category.toLowerCase()}* 」❍\n`;
      }

      const commands = grouped[category];
      commands.forEach((cmd) => {
        helpText += `│ ${setv} :${cmd.name} ${cmd.help || ""}\n`;
      });

      if (catIndex < categories.length - 1) {
        const nextCategory = categories[catIndex + 1];
        helpText += `╰─┬────❍\n`;
        helpText += `╭─┴─❍「 *${nextCategory.toLowerCase()}* 」❍\n`;
      } else {
        helpText += "╰──────❍\n";
      }
    });

    const message: any = {
      document: generate.doc,
      fileName: "Invoke RiqueX",
      mimetype: "image/jpeg",
      fileLength: "245000000",
      jpegThumbnail: await reSize("./media/doc.jpg", 300, 300), 
      caption: styles(helpText),
      contextInfo: {
        mentionedJid: [sender, ownerJid, "0@s.whatsapp.net"],
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
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: "https://files.catbox.moe/d5d2x5.jpg",
          mediaUrl: "https://github.com/HenriqueX-Flow",
          sourceUrl: "https://github.com/HenriqueX-Flow",
          originalImageUrl: "https://files.catbox.moe/y12axo.png"
        },
        businessMessageForwardInfo: {
          businessOwnerJid: "558896110835@s.whatsapp.net"
        }
      }
    };

    await ctx.socket.sendMessage(jid, {
      react: { text: getRandomReact, key: msg.key },
    });
    await ctx.socket.sendMessage(jid, message, { quoted: msg });
  },
};

export default menu;
