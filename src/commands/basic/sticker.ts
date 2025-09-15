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
  intro: true,
  usage: "Marque Uma Mídia Com :sticker",
  aliases: ["s", "f", "figurinha"],
  async execute(ctx, msg) {
    const jid = msg.key.remoteJid!;

    if (!isImage(msg) && !isVideo(msg)) {
      await sendReply(ctx, "Marque Uma Mídia Imagem Ou Vídeo", msg);
      return;
    }

    const buffer = await downloadMedia(msg);
    if (!buffer) {
      await sendReply(ctx, "Ocorreu Um Erro Ao Baixar A Mídia.", msg);
      return;
    }

    try {
      const stk = await sticker(
        buffer,
        undefined,
        "Invoke-RiqueX",
        `${msg.pushName || "HenriqueX"}`,
      );

      await ctx.socket.sendMessage(jid, { sticker: stk }, { quoted: msg });
    } catch (e) {
      console.error("Erro Ao Criar Sticker:", e);
      await sendReply(ctx, "Ocorreu Um Erro Ao Criar A Figurinha.", msg);
    }
  },
};

export default StickerMedia;