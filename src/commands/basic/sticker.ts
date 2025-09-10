import { ICommand } from "../../common/interface";
import {
  downloadMedia,
  isImage,
  isVideo,
  sendMsg,
  sendReply,
} from "../../common/utils/message";
import { imageToWeb, videoToWeb } from "../../common/utils/sticker";

const StickerMedia: ICommand = {
  name: "sticker",
  help: "<midia>",
  category: "basicos",
  aliases: ["s", "f", "figurinha"],
  async execute(ctx, msg) {
    const jid = msg.key.remoteJid!;

    if (!isImage(msg)) {
      await sendReply(ctx, "Marque Uma Mídia Imagem", msg);
      return;
    }

    const buffer = await downloadMedia(msg);
    if (!buffer) {
      await sendReply(ctx, "Ocorreu Um Erro Inesperado.", msg);
      return;
    }

    try {
      let webp: Buffer;

      if (isImage(msg)) {
        webp = await imageToWeb(buffer);
      } else {
        webp = await videoToWeb(buffer);
      }

      return await ctx.socket.sendMessage(jid, { sticker: webp }, { quoted: msg });
    } catch (e) {
      console.error(e);
      await sendReply(ctx, "Ocorreu Um Erro", msg);
    }
  },
};

export default StickerMedia;
