import { ICommand } from "../../common/interface";
import { isAdmin, isBotAdmin, isGroup, sendReply } from "../../common/utils/message";

const promote: ICommand = {
  name: "promote",
  help: "[@usuario]",
  category: "admins",
  aliases: ["promover"],
  usage: "Mencione Ou Marque A Mensagem Do Usuário Com :promote Para Promover A Admin Do Grupo.",
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
          await sendReply(ctx, "Marque Ou Mencione Um Usuário Para Promover.", msg);
          return;
        }

        await ctx.socket.groupParticipantsUpdate(jid, [jidReply], "promote");
        return;
      }

    await ctx.socket.groupParticipantsUpdate(jid, Array.isArray(jidMention) ? jidMention : [jidMention], "promote");
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

export default promote;
