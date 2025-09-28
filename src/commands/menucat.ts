import fs from "fs";
import { ICommand } from "../common/interface";
import { getRandom, sendReply } from "../common/utils/message";
import moment from "moment-timezone";
import { config, reSize } from "../config";

const day = moment.tz("America/Fortaleza").locale("pt-BR").format("dddd");
const date = moment.tz("America/Fortaleza").locale("pt-BR").format("DD/MM/YYYY");
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
    const listDocs = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/pdf"]
    const category = args[0]?.toLowerCase();
    const setv = getRandom(config.listv);
    const commands = bot.commands;

    const order = {
        key: {
          fromMe: false,
          participant: msg.key.participant!,
          remoteJid: msg.key.remoteJid!,
        },
        message: {
          orderMessage: {
            itemCount: 245,
            status: 200,
            thumbnail: await reSize("./media/doc.jpg", 300, 300),
            surface: 200,
            message: "Belo Produto 😈",
            orderTitle: "Invoke RiqueX",
            sallerJid: "0@s.whatsapp.net"
          }
        },
        contextInfo: {
          sendEphemeral: true,
        },
    };

    const payment = {
      key: {
        remoteJid: msg.key.remoteJid!,
        fromMe: false,
        id: "Invoke RiqueX",
        participant: msg.key.participant || msg.key.remoteJid!,
      },
      message: {
        requestPaymentMessage: {
          currencyCodeIso4217: "BRL",
          amount1000: 10000,
          resquestFrom: "558888205721@s.whatsapp.net",
          noteMessage: {
            extendedTextMessage: {
              text: "Belo Produto 😈"
            }
          },
          expiryTimestamp: 9999999,
          amount: {
            value: 15000,
            offset: 10000,
            currencyCode: "BRL"
          }
        }
      }
    }

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
          txt += `│ ${setv} :${cmd.name}${cmd.help ? ` - *${cmd.help}*` : ""}\n`;
        }

        if (i === validCats.length - 1) {
          txt += `╰──────❍\n`;
        }
      });

      const message: any = {
        document: fs.readFileSync("./media/menu.pdf"),
        fileName: "Invoke RiqueX",
        mimeType: getRandom(listDocs),
        fileLength: 245000000,
        pageCount: "245",
        caption: txt,
        contextInfo: {
          isForwarded: true,
          externalAdReply: {
            title: "Invoke RiqueX",
            body: "© HenriqueX-Flow",
            thumbnailUrl: "https://files.catbox.moe/d5d2x5.jpg",
            mediaType: 1,
            previewType: 0,
            renderLargerThumbnail: true,
            mediaUrl: "https://github.com/HenriqueX-Flow",
            sourceUrl: "https://github.com/HenriqueX-Flow"
          }
        }
      }

      await ctx.socket.sendMessage(jid, message, { quoted: order });


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
        product: {
        productImage: { url: "https://files.catbox.moe/d5d2x5.jpg" },
        productId: "25002205439375014",
        title: "© HenriqueX-Flow",
        description: "Invoke RiqueX Bot",
        salePriceAmount1000: 10000,
        priceAmount1000: 15000,
        currencyCode: "BRL",
        retailerId: "HenriqueX",
        url: null,
        },
        businessOwnerJid: "558888205721@s.whatsapp.net",
        caption: `╭──❍「 *USUÁRIO* 」❍\n├ *Nome :* ${name}\n├ *Menção :* @${sender.split("@")[0]}\n╰─┬────❍\n╭─┴─❍「 *BOT* 」❍\n├ *Bot :* ${config.botName}\n├ *Powered :* @${"0@s.whatsapp.net".split("@")[0]}\n├ *Criador :* ${ownerMention}\n╰─┬────❍\n╭─┴─❍「 *TEMPO* 」❍\n├ *Hora :* ${hours}\n├ *Dia :* ${day}\n├ *Data :* ${date}\n╰──────❍`,
        footer: "© HenriqueX-Flow",
        media: true,
        interactiveButtons: [
          {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
              title: "𝙻𝙸𝚂𝚃𝙰 𝙳𝙴 𝙼𝙴𝙽𝚄𝚂",
              sections: [
                {
                  highlight_label: "© HenriqueX-Flow",
                  rows: [
                    {
                      header: "Menu Completo",
                      title: "Mostrar O Menu Completo",
                      description: "Exibe O Menu Principal Com Todos Os Comandos",
                      id: ":menu completo"
                    },
                    {
                      header: "Menu Basicos",
                      title: "Mostrar Os Comando Basicos",
                      description: "Exibe Um Menu Com Somente Comandos Basicos",
                      id: ":menu basicos"
                    },
                    {
                      header: "Menu Geral",
                      title: "Mostrar Os Comandos Da Categoria Geral",
                      description: "Exibe Um Menu Com Somente Comandos Da Categoria Geral",
                      id: ":menu geral"
                    },
                    {
                      header: "Menu Ferramentas",
                      title: "Mostrar Os Comandos Da Categoria Ferramentas",
                      description: "Exibe Um Menu Com Somente Comandos Da Categoria Ferramentas",
                      id: ":menu ferramentas",
                    },
                    {
                      header: "Menu Admins",
                      title: "Mostrar Os Comandos De Admins",
                      description: "Exibe Um Menu Com Somente Comandos Da Categoria Admins",
                      id: ":menu admins"
                    },
                    {
                      header: "Menu Criador",
                      title: "Mostrar Os Comandos Do Criador",
                      description: "Exibe Um Menu Com Somente Comandos Do Criador",
                      id: ":menu criador"
                    }
                  ]
                }
              ]
            })
          },
          {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
              display_text: "𝙲𝚁𝙸𝙰𝙳𝙾𝚁 | 𝙷𝙴𝙽𝚁𝙸𝚀𝚄𝙴𝚇",
              id: ":dev"
            })
          },
          {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
              display_text: "𝙿𝙸𝙽𝙶 | 𝙸𝙽𝙵𝙾",
              id: ":ping"
            })
          }
        ],
        mentions: [sender, ownerJid, "0@s.whatsapp.net"]
      };

      await ctx.socket.sendMessage(jid, message, { quoted: payment });
    }
  },
};

export default menu;
