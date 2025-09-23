import { ICommand } from "../../common/interface";
import { sendReply } from "../../common/utils/message";

const make: ICommand = {
  name: "make",
  help: "*[texto]*",
  category: "ferramentas",
  async execute(ctx, msg, args) {
    const jid = msg.key.remoteJid!;
    const text = args.join(" ");

    if (!text) {
      await sendReply(ctx, "Coloque O Texto", msg);
      return;
    }

    let time = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Fortaleza",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(new Date())

    await ctx.socket.sendMessage(jid, {
      image: { url: `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(time)}&batteryPercentage=${Math.floor(Math.random() * 100) + 1}&carrierName=INDOSAT&messageText=${encodeURIComponent(text.trim())}&emojiStyle=apple`}
    }, { quoted: msg })
  }
}

export default make;
