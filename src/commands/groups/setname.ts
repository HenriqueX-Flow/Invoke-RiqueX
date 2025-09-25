import { ICommand } from "../../common/interface";
import { isAdmin, isBotAdmin, isGroup, sendReply } from "../../common/utils/message";

const setGroupName: ICommand = {
  name: "setnamegp",
  help: "(nome)",
  category: "admins",
  aliases: ["nomegp"],
  usage: ":setnamegp grupo de devs",
  async execute(ctx, msg, args) {
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
      await sendReply(ctx, "O Bot Precisa Ser Admin Do Grupo.", msg);
      return;
    }

    const text = args?.join(" ");
    if (!text) {
      await sendReply(ctx, "Escreva Um Nome Para O Grupo", msg);
      return;
    }

    await ctx.socket.groupUpdateSubject(jid, text).catch((err) => sendReply(ctx, "Ocorreu Um Erro", msg));
  }
}

export default setGroupName;
