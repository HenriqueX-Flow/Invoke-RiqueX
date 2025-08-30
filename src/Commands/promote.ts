import { ICommand } from "../Common/types";
import { sendReply } from "../Utils/message";

const Promote: ICommand = {
  name: "promover",
  help: "*<@user>*",
  category: "admins",
  async run(ctx, msg) {
    const jid = msg.key.remoteJid!;
    if (!jid.endsWith("@g.us")) {
      await sendReply(ctx, "Esse Comando Só Pode Ser Usado Em Grupo.", msg);
      return;
    }
    

    const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;

    if (!mentionedJid || mentionedJid.length === 0) {
      await sendReply(ctx, "Marque Ou Mencione Um Usuário.", msg);
      return;
    }

    const sender = msg.key.participant!;
    const metadata = await ctx.sock.groupMetadata(jid);
    const admins = metadata.participants.filter(p => p.admin !== null).map(p => p.id);

    if (!admins.includes(sender)) {
      await sendReply(ctx, "Somente Admins Podem Usar Esse Comando.", msg);
      return;
    }

    await ctx.sock.groupParticipantsUpdate(jid, mentionedJid, "promote");
    await sendReply(ctx, "Usuário Promovido", msg)
  }
}

export default Promote;
