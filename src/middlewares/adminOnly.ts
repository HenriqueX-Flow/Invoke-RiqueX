import { Middleware } from "../Common/middleware";
import { proto } from "baileys";

const adminOnly: Middleware = async ({ ctx, msg, command, next }) => {
  if (command.name !== "ban")
    return next();

  const jid = msg.key.remoteJid!; 
  const metadata = await ctx.sock.groupMetadata(jid);

  const sender = msg.key.participant;
  const admins = metadata.participants.filter(p => p.admin !== null).map(p => p.id);

  if (!admins.includes(sender!)) {
    await ctx.sock.sendMessage(jid, { text: "Você Não É admin."});
    return;
  }

  await next();
};

export default adminOnly;
