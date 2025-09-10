import { ICommand } from "../../common/interface";
import {
  downloadMedia,
  isImage,
  isVideo,
  sendReply,
} from "../../common/utils/message";
import { sticker } from "../../common/utils/sticker";

const StickerMedia: ICommand = {
  name: "sticker",
  help: "<mídia>",
  category: "basicos",
  aliases: ["s", "f", "figurinha"],
  async execute(ctx, msg) {
    const jid = msg.key.remoteJid!;

    if (!isImage(msg) && !isVideo(msg)) {
      await sendReply(ctx, "Marque uma mídia (imagem ou vídeo)", msg);
      return;
    }

    const buffer = await downloadMedia(msg);
    if (!buffer) {
      await sendReply(ctx, "Ocorreu um erro ao baixar a mídia.", msg);
      return;
    }

    try {
      // Cria sticker a partir da mídia (imagem ou vídeo)
      const stk = await sticker(buffer, undefined, "Invoke-RiqueX", `${msg.pushName || "HenriqueX"}`);

      await ctx.socket.sendMessage(jid, { sticker: stk }, { quoted: msg });
    } catch (e) {
      console.error("Erro ao criar sticker:", e);
      await sendReply(ctx, "Ocorreu um erro ao criar a figurinha.", msg);
    }
  },
};

export default StickerMedia;