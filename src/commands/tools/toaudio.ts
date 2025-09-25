import { ICommand } from "../../common/interface";
import { toAudio } from "../../common/utils/converter";
import { downloadMedia, isVideo, sendReply } from "../../common/utils/message";

const toaudio: ICommand = {
  name: "toaudio",
  help: "(video)",
  category: "ferramentas",
  intro: true,
  usage: "Marque Um Video Com :toaudio Para Transformar O Video Em Audio",
  async execute(ctx, msg) {
    const jid = msg.key.remoteJid!;

    if (!isVideo(msg)) {
      await sendReply(ctx, "Marque Um Vídeo", msg);
      return;
    }

    let media = await downloadMedia(msg);
    if (!media) {
      await sendReply(ctx, "Ocorreu Um Erro", msg);
      return;
    }

    try {
      let audio = await toAudio(media, "mp4");
      await ctx.socket.sendMessage(jid, {
        audio: audio.data,
        mimetype: "audio/mpeg",
      }, { quoted: msg });

      await audio.delete();

    } catch {
      await sendReply(ctx, "Ocorreu Um Erro", msg);
    }
  },
};

export default toaudio;
