import { ICommand } from "../Common/types";
import { downloadMedia, isImage, isVideo } from "../Utils/message";
import { imageToWeb, videoToWeb } from "../Utils/sticker";

const StickerCmd: ICommand = {
  name: "sticker",
  description: "Transforma Uma Imagem ou Vídeo Em Figurinha.",
  category: "basicos",
  aliases: ["s"],
  async run(ctx, msg) {
    const jid = msg.key.remoteJid!;

    if (!isImage(msg) && !isVideo(msg)) {
      await ctx.sock.sendMessage(jid, { text: "Marque uma imagem ou vídeo de até 10s." });
      return;
    }

    const buffer = await downloadMedia(msg);
    if (!buffer) {
      await ctx.sock.sendMessage(jid, { text: "Erro ao baixar mídia." });
      return;
    }

    try {
      let webp: Buffer;

      if (isImage(msg)) {
        webp = await imageToWeb(buffer);
      } else {
        webp = await videoToWeb(buffer);
      }

      await ctx.sock.sendMessage(jid, { sticker: webp });
    } catch (e) {
      console.error("Erro ao converter para sticker:", e);
      await ctx.sock.sendMessage(jid, { text: "Falha ao criar figurinha." });
    }
  }
}

export default StickerCmd;
