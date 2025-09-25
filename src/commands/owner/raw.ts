import { ICommand } from "../../common/interface";
import { isOwner, sendReply } from "../../common/utils/message";
import { reSize } from "../../config";

const rawCmd: ICommand = {
  name: "raw",
  category: "criador",
  help: "(msg)",
  usage: "Marque Uma Mensagem Com :raw Para Obter Informações",
  async execute(ctx, msg) {
    const jid = msg.key.remoteJid!;
    const raw = JSON.stringify(msg, null, 2);

    if (!isOwner(msg)) {
      await sendReply(ctx, "Somente O Criador", msg);
      return;
    }

    if (raw.length > 5000) {
      await sendReply(ctx, "Mensagem Muito Grande, Vou Enviar Em Um .json 👍", msg);
      const buffer = Buffer.from(raw, "utf-8");
      const message: any = {
        document: buffer,
        fileName: "raw.json",
        mimetype: "image/jpeg",
        jpegThumbnail: await reSize("./media/doc.jpg", 300, 300),
        caption: "Por Favor Dev Clica Na Imagem Com A Opção De Download 👆",
        contextInfo: {
          isForwarded: true,
          externalAdReply: {
            title: "Invoke RiqueX",
            body: "© HenriqueX",
            mediaType: 1,
            previewType: 0,
            renderLargerThumbnail: true,
            thumbnailUrl: "https://files.catbox.moe/d5d2x5.jpg",
            mediaUrl: "https://github.com/HenriqueX-Flow",
            sourceUrl: "https://github.com/HenriqueX-Flow",
          }
        }
      }
      await ctx.socket.sendMessage(jid, message, { quoted: msg });
    } else {
      await sendReply(ctx, "```" + raw + "```", msg);
    }
  }
}

export default rawCmd;
