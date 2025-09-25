import { ICommand } from "../../common/interface";
import {
  downloadMedia,
  isImage,
  sendReply,
} from "../../common/utils/message";
import { sticker } from "../../common/utils/sticker";
import Jimp from "jimp";

async function makeRoundImage(buffer: Buffer): Promise<Buffer> {
  const image = await Jimp.read(buffer);
  image.resize(512, 512);

  image.circle();

  return await image.getBufferAsync(Jimp.MIME_PNG);
}

const StickerRound: ICommand = {
  name: "stickerround",
  help: "(imagem)",
  category: "basicos",
  aliases: ["sr", "stkrnd"],
  async execute(ctx, msg) {
    const jid = msg.key.remoteJid!;

    if (!isImage(msg)) {
      await sendReply(ctx, "Marque Uma Imagem Para Criar A Figurinha Redonda.", msg);
      return;
    }

    const buffer = await downloadMedia(msg);
    if (!buffer) {
      await sendReply(ctx, "Erro Ao Baixar A Mídia.", msg);
      return;
    }

    try {
      const roundBuffer = await makeRoundImage(buffer);

      const stk = await sticker(
        roundBuffer,
        undefined,
        "Invoke-RiqueX",
        `${msg.pushName || "HenriqueX"}`
      );

      await ctx.socket.sendMessage(jid, { sticker: stk }, { quoted: msg });
    } catch (e) {
      console.error("Erro Ao Criar Sticker Redondo:", e);
      await sendReply(ctx, "Ocorreu Um Erro Ao Criar A Figurinha Redonda.", msg);
    }
  },
};

export default StickerRound;