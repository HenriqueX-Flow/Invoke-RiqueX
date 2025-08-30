import { ICommand } from "../Common/types";
import { sendReply } from "../Utils/message";

const Raw: ICommand = {
  name: "raw",
  category: "criador",
  help: "*<msg>*",
  async run(ctx, msg) {
    const jid = msg.key.remoteJid!;
    const raw = JSON.stringify(msg, null, 2);

    if (raw.length > 4000) {
      await sendReply(ctx, "Mensagem Muito Grande, Vou Enviar Em Um .json 👍", msg);
      const buffer = Buffer.from(raw, "utf-8");
      await ctx.sock.sendMessage(jid, {
        document: buffer,
        fileName: "Raw.json",
        mimetype: "application/json",
      }, { quoted: msg });
    } else {
      await sendReply(ctx, "```" + raw + "```", msg);
    }
  }
};

export default Raw;