import { ICommand } from "../../common/interface";
import { sticker } from "../../common/utils/sticker";
import axios from "axios";

const QuotedSticker: ICommand = {
  name: "qc",
  category: "basicos",
  help: "<texto>",
  async execute(ctx, msg, args) {
    const jid = msg.key.remoteJid!;
    const name = msg.pushName || "Sem Nome";

    const text = args.join(" ");
    const profile = await ctx.socket
      .profilePictureUrl(jid)
      .catch(() => "https://i.ibb.co/4pDNDk1/avatar.png");

    const obj = {
      type: "quote",
      format: "png",
      backgroundColor: "FF212121",
      width: 1024,
      height: 1024,
      scale: 2,
      messages: [
        {
          entities: [],
          avatar: true,
          from: {
            id: 1,
            name: name,
            photo: { url: profile },
          },
          text: text,
          replyMessage: {},
        },
      ],
    };

    const json = await axios.post("https://bot.lyo.su/quote/generate", obj, {
      headers: { "Content-Type": "application/json" },
    });

    const buffer = Buffer.from(json.data.result.image, "base64");

    const stk = await sticker(buffer, undefined, "Invoke-RiqueX", "Bot");

    if (stk) {
      await ctx.socket.sendMessage(
        jid,
        { sticker: stk },
        { quoted: msg }
      );
    }
  },
};

export default QuotedSticker;