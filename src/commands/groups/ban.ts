import { ICommand } from "../../common/interface";
import { isAdmin, isBotAdmin, isGroup, sendReply } from "../../common/utils/message";
import { config } from "../../config";

const ban: ICommand = {
  name: "ban",
  help: "(@user)",
  category: "admins",
  aliases: ["remove", "kick"],
  usage: "Mencione Ou Marque A Mensagem Do Usuário Com :ban Para Remover.",
  async execute(ctx, msg) {
    const jid = msg.key.remoteJid!;

    if (!isGroup(msg)) {
      await sendReply(ctx, "Comando Exclusivo Para Grupo.", msg);
      return;
    }

    if (!(await isAdmin(ctx, msg))) {
      await sendReply(ctx, "Comando Exclusivo Para Admins Do Grupo.", msg);
      return;
    }

    if (!(await isBotAdmin(ctx, msg))) {
      await sendReply(ctx, `${config.botName} Precisa Ser Admin Do Grupo Para Remover Alguém.`, msg);
      return;
    }

    const jidMentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const jidReply = msg.message?.extendedTextMessage?.contextInfo?.participant; // <- corrigido

    try {
      if (!jidMentioned || jidMentioned.length === 0) {
        if (!jidReply) {
          await sendReply(ctx, "Marque Ou Mencione O Usuário Para Remover Do Grupo.", msg);
          return;
        }

        await ctx.socket.groupParticipantsUpdate(jid, [jidReply], "remove");
        return;
      }

      await ctx.socket.groupParticipantsUpdate(jid, Array.isArray(jidMentioned) ? jidMentioned : [jidMentioned], "remove");
      await ctx.socket.sendMessage(jid, {
        react: { text: "👍", key: msg.key }
      });
    } catch {
      await ctx.socket.sendMessage(jid, {
        react: { text: "👎", key: msg.key }
      });
      await sendReply(ctx, "Erro Ao Remover Usuário.", msg);
    }
  }
};

export default ban;
