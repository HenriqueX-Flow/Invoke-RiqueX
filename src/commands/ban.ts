import { kill } from "process";
import { ICommand } from "../Common/types";

const Ban: ICommand = {
  name: "ban",
  description: "Remove Um Usuário Do Grupo",
  async run(ctx, msg, args) {
      const jid = msg.key.remoteJid!;
    if (!jid.endsWith("@g.us")) {
      await ctx.sock.sendMessage(jid, {
        text: "So Em Grupos"
      })
      return;
    }

    if (args.length === 0) {
      await ctx.sock.sendMessage(jid, {
        text: "Use !ban @usuario"
      })
      return;
    }

    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;

    if (!mentioned || mentioned.length === 0) {
      await ctx.sock.sendMessage(jid, {
        text: "Marque O Usuário"
      });
      return;
    }

    await ctx.sock.groupParticipantsUpdate(jid, mentioned, "remove");
  },
};

export default Ban;
