import { type } from "os";
import { ICommand } from "../common/interface";
import { getRandom, sendReply } from "../common/utils/message";
import fs from "fs";
import moment from "moment-timezone";
import { config } from "../config";

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

function uniqueCommands(cmds: ICommand[]) {
  const seen = new Set<string>();
  return cmds.filter((cmd) => {
    if (seen.has(cmd.name)) return false;
    seen.add(cmd.name);
    return true;
  });
}

const menu: ICommand = {
  name: "menu",
  help: "(categoria)",
  category: "geral",
  usage: "menu [categoria]",
  async execute(ctx, msg, args, bot) {
    const jid = msg.key.remoteJid!;
    const sender = msg.key.participant || msg.key.remoteJid!;
    const name = msg.pushName || "Desconhecido";

    const category = args[0]?.toLowerCase();
    const setv = getRandom(config.listv);
    const commands = bot.commands;

    if (category === "completo") {
      const categories = ["basicos", "geral", "admins", "ferramentas", "criador"];

      let txt = `*MENU COMPLETO*\n\n`;

      const validCats = categories.filter((cat) =>
        [...commands.values()].some((cmd) => cmd.category === cat)
      );

      validCats.forEach((cat, i) => {
        const filtered = uniqueCommands(
          [...commands.values()].filter((cmd) => cmd.category === cat)
        );

        if (!filtered.length) 
          return;

        if (i === 0) {
          txt += `╭──❍「 *${cat.toUpperCase()}* 」❍\n`;
        } else {
          txt += `╰─┬────❍\n╭─┴─❍「 *${cat.toUpperCase()}* 」❍\n`;
        }

        for (const cmd of filtered) {
          txt += `│ ${setv} ${cmd.name}${cmd.help ? ` - *${cmd.help}*` : ""}\n`;
        }

        if (i === validCats.length - 1) {
          txt += `╰──────❍\n`;
        }
      });

      await sendReply(ctx, styles(txt), msg);

    } else if (category) {
      const filtered = uniqueCommands(
        [...commands.values()].filter(
          (cmd) => cmd.category.toLowerCase() === category
        )
      );

      if (!filtered.length) {
        await sendReply(ctx, `Categoria *${category}* Não Encontrada.`, msg);
        return;
      }

      let txt = `*MENU - ${category.toUpperCase()}*\n\n`;
      txt += `╭──❍「 *${category.toUpperCase()}* 」❍\n`;

      for (const cmd of filtered) {
        txt += `│ ${cmd.name}${cmd.help ? ` - ${cmd.help}` : ""}\n`;
      }

      txt += `╰──────❍`;

      await sendReply(ctx, txt, msg);

    } else {
      const message: any = {
        image: fs.readFileSync("./media/header.jpg"),
        caption: `╭──❍「 *USUÁRIO* 」❍\n├ *Nome :* ${name}\n├ *Menção :* @${sender.split("@")[0]}\n╰─┬────❍\n╭─┴─❍「 *BOT* 」❍\n├ *Bot :* ${config.botName}\n├ *Powered :* @${"0@s.whatsapp.net".split("@")[0]}\n├ *Criador :* ${ownerMention}\n╰─┬────❍\n╭─┴─❍「 *Tempo* 」❍\n├ *Hora :* ${hours}\n├ *Dia :* ${day}\n├ *Data :* ${date}\n╰──────❍\n`,
        footer: "© HenriqueX-Flow",
        buttons: [
          {
            buttonId: ":dev",
            buttonText: { displayText: "𝙲𝚁𝙸𝙰𝙳𝙾𝚁 | 𝙷𝙴𝙽𝚁𝙸𝚀𝚄𝙴𝚇" },
            type: 1,
          },
          {
          buttonId: ":ping",
          buttonText: { displayText: "𝙿𝙸𝙽𝙶 | 𝙸𝙽𝙵𝙾" },
          type: 1,
          },
          {
            buttonId: "action",
            buttonText: { displayText: "The Interactive Message" },
            type: 0,
            nativeFlowInfo: {
              name: "single_select",
              paramsJson: JSON.stringify({
                title: "𝙻𝙸𝚂𝚃𝙰 𝙳𝙴 𝙼𝙴𝙽𝚄𝚂",
                sections: [
                  {
                    title: "Flow De Menus",
                    highlight_label: "© HenriqueX-Flow",
                    rows: [
                      {
                        header: "Menu Completo",
                        title: "Mostra O Menu Com Todos Os Comandos",
                        description: "Menu Com Todos Os Comandos E Categoria",
                        id: ":menu completo",
                      },
                      {
                        header: "Menu Basicos",
                        title: "Mostra O Menu Com Somente Comandos Da Categoria Basica",
                        description: "Menu De Comandos Basicos",
                        id: ":menu basicos",
                      },
                      {
                        header: "Menu Geral",
                        title: "Mostra O Menu Com Somente Comandos Da Categoria Geral",
                        description: "Menu De Comandos Gerais",
                        id: ":menu geral",
                      },
                      {
                        header: "Menu Admins",
                        title: "Mostra O Menu Com Somente Comandos Da Categoria Admins",
                        description: "Menu De Comandos Admin",
                        id: ":menu admins",
                      },
                    ],
                  },
                ],
              }),
            },
          },
        ],
        viewOnce: true,
        contextInfo: {
          isForwarded: true,
          mentionedJid: [sender, ownerJid, "0@s.whatsapp.net"],
          externalAdReply: {
            title: "Invoke RiqueX",
            body: "© HenriqueX-Flow",
            mediaType: 1,
            previewType: 0,
            renderLargerThumbnail: true,
            thumbnailUrl: "https://files.catbox.moe/d5d2x5.jpg",
            mediaUrl: "https://github.com/HenriqueX-Flow",
            sourceUrl: "https://github.com/HenriqueX-Flow",
          },
        },
      };

      await ctx.socket.sendMessage(jid, message, { quoted: msg });
    }
  },
};

export default menu;
