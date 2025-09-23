import { ICommand } from "../../common/interface";
import { isAdmin, isBotAdmin, isGroup, sendReply } from "../../common/utils/message";

const demote: ICommand = {
  name: "demote",
  help: "[@usuario]",
  category: "admins",
  aliases: ["rebaixar"],
  usage: "Mencione Ou Marque A Mensagem Do Usuário Com :demote Para Remover Da Lista De Admins Do Grupo.",
  async execute(ctx, msg) {
    const jid = msg.key.remoteJid!;

    if (!isGroup(msg)) {
      await sendReply(ctx, "Comando Exclusivo Para Grupos.", msg);
      return;
    }

    if (!(await isAdmin(ctx, msg))) {
      await sendReply(ctx, "Comando Exclusivo Para Admins Do Grupo.", msg);
      return;
    }

    if (!(await isBotAdmin(ctx, msg))) {
      await sendReply(ctx, "O Bot Precisa Ser Admin Do Grupo", msg);
      return;
    }

    const jidMention = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const jidReply = msg.message?.extendedTextMessage?.contextInfo?.participant;

    try {
      if (!jidMention || jidMention.length === 0) {
        if (!jidReply) {
          await sendReply(ctx, "Marque Ou Mencione Um Usuário Para Remover Da Lista De Admins.", msg);
          return;
        }

        await ctx.socket.groupParticipantsUpdate(jid, [jidReply], "demote");
        return;
      }

    await ctx.socket.groupParticipantsUpdate(jid, Array.isArray(jidMention) ? jidMention : [jidMention], "demote");
      await ctx.socket.sendMessage(jid, {
        react: { text: "👍", key: msg.key }
      });
    } catch {
      await ctx.socket.sendMessage(jid, {
        react:  { text: "👎", key: msg.key }
      });
    }
  }
}

export default demote;
