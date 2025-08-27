import { ICommand } from "../Common/types";

const Ban: ICommand = {
  name: "ban",
  description: "Remove O Usuário Do Grupo.",
  category: "admin",
  aliases: ["remove", "kick"],
  async run(ctx, msg) {
    const jid = msg.key.remoteJid!;
    if (!jid.endsWith("@g.us")) {
      await ctx.sock.sendMessage(jid, {
        text: "Esse Comando Só Pode Ser Usado Em Grupos"
      }, { quoted: msg });
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
