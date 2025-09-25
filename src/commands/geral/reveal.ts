import { ICommand } from "../../common/interface";
import {
  downloadMedia,
  isAudio,
  isImage,
  isVideo,
  sendMedia,
  sendReply,
} from "../../common/utils/message";

const reveal: ICommand = {
  name: "revelar",
  help: "(midia)",
  category: "geral",
  aliases: ["readviewonce"],
  async execute(ctx, msg) {
    const jid = msg.key.remoteJid!;

    if (
      !msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ?.imageMessage?.viewOnce &&
      !msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ?.videoMessage?.viewOnce &&
      !msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ?.audioMessage?.viewOnce
    ) {
      await sendReply(ctx, "Marque Uma Mídia", msg);
      return;
    }

    const buffer = await downloadMedia(msg);
    if (!buffer) {
      await sendReply(ctx, "Erro", msg);
      return;
    }

    await sendMedia(ctx, jid, buffer);
  },
};

export default reveal;
