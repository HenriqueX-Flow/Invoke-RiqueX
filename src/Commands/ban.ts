import { ICommand } from "../Common/types";
import { sendReply } from "../Utils/message";

const Ban: ICommand = {
  name: "ban",
  help: "*<@user>*.",
  category: "admins",
  aliases: ["remove", "kick"],
  async run(ctx, msg) {
    const jid = msg.key.remoteJid!;
    if (!jid.endsWith("@g.us")) {
      await sendReply(ctx, "Esse Comando Só Pode Ser Usado Em Grupos.", msg);
      return;
    }

    const jidMentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;

    if (!jidMentioned || jidMentioned.length === 0) {
      await ctx.sock.sendMessage(jid, {
        text: "Marque O Usuário Que Deseja Banir Do Grupo."
      }, { quoted: msg });
      return;
    }

    await ctx.sock.groupParticipantsUpdate(jid, jidMentioned, "remove");
    await ctx.sock.sendMessage(jid, {
      react: { text: "👍", key: msg.key }
    })
  },
};

export default Ban;
