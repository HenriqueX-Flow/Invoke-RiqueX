import { ICommand } from "../../common/interface";
import { downloadMedia, isVideo, sendReply } from "../../common/utils/message";
import { prepareWAMessageMedia, generateWAMessageFromContent } from "baileys-mod";

const toptv: ICommand = {
  name: "toptv",
  help: "(video)",
  category: "ferramentas",
  usage: "Marque Uma Mensagem De Vídeo Com :toptv",
  async execute(ctx, msg) {
    const jid = msg.key.remoteJid!;

    if (!isVideo(msg)) {
      await sendReply(ctx, "Marque um vídeo", msg);
      return;
    }

    const buffer = await downloadMedia(msg);
    if (!buffer) {
      await sendReply(ctx, "Não foi possível baixar o vídeo.", msg);
      return;
    }

    const media = await prepareWAMessageMedia(
      { video: buffer },
      { upload: ctx.socket.waUploadToServer }
    );

    const ptv = generateWAMessageFromContent(
      jid,
      {
        ptvMessage: {
          ...media.videoMessage,
          seconds: 10,
          gifPlayback: false,
        },
      },
      { userJid: jid }
    );

    await ctx.socket.relayMessage(jid, ptv.message!, {
      messageId: ptv.key.id ?? undefined,
    });
  },
};

export default toptv;