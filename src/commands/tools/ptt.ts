import { ICommand } from "../../common/interface";
import { toPTT } from "../../common/utils/converter";
import {
  downloadMedia,
  isAudio,
  isVideo,
  sendReply,
} from "../../common/utils/message";

const tovoz: ICommand = {
  name: "tovoz",
  help: "<vídeo|áudio>",
  category: "ferramentas",
  intro: true,
  aliases: ["tovoice", "toptv"],
  usage: "Marque Um Vídeo Ou Áudio Com :tovoz Para Transformar Em Nota De Voz",
  async execute(ctx, msg) {
    const jid = msg.key.remoteJid!;

    if (!isVideo(msg) && !isAudio(msg)) {
      await sendReply(ctx, "Marque Um Vídeo Ou Áudio", msg);
      return;
    }

    let media = await downloadMedia(msg);
    if (!media) {
      await sendReply(ctx, "Ocorreu Um Erro Ao Baixar A Mídia", msg);
      return;
    }

    try {
      let ptt = await toPTT(media, isVideo(msg) ? "mp4" : "mp3");

      await ctx.socket.sendMessage(
        jid,
        {
          audio: ptt.data,
          mimetype: "audio/ogg; codecs=opus",
          ptt: true,
        },
        { quoted: msg },
      );

      await ptt.delete();
    } catch (e) {
      console.error(e);
      await sendReply(ctx, "Ocorreu Um Erro Na Conversão", msg);
    }
  },
};

export default tovoz;
