import { ICommand } from "../common/interface";
import { config } from "../config";

const devFlow: ICommand = {
  name: "dev",
  help: "",
  category: "basicos",
  async execute(ctx, msg) {
    const jid = msg.key.remoteJid!;

    const contact = {
      displayName: "HenriqueX Flow",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;;;;\nFN: ${config.ownerName}\nitem1.TEL;waid=558888205721:558888205721\nitem1.X-ABLabel:\nContanto Do Meu Criador.\nEND:VCARD`
    };
    
    await ctx.socket.sendMessage(jid, {
      contacts: {
        contacts: [contact]
      },
      contextInfo: {
        isForwarded: true,
        externalAdReply: {
          showAdAttribution: true,
          renderLargerThumbnail: true,
          title: "Invoke RiqueX",
          body: "© HenriqueX-Flow",
          containsAutoReply: true,
          mediaType: 1,
          thumbnailUrl: "https://files.catbox.moe/d5d2x5.jpg",
          mediaUrl: "https://files.catbox.moe/d5d2x5.jpg",
          sourceUrl: "https://github.com/HenriqueX-Flow"
        }
      }
    }, { quoted: msg });
  }
}

export default devFlow;
