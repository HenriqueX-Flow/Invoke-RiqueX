import { ICommand } from "../../common/interface";
import { isAdmin, isBotAdmin, isGroup, sendReply } from "../../common/utils/message";

const groupSettings: ICommand = {
  name: "group",
  help: "(opção)",
  category: "admins",
  aliases: ["grupo", "gp"],
  usage: "Abre Ou Fecha O Grupo Exemplo :group fechar",
  async execute(ctx, msg, args) {
    const jid = msg.key.remoteJid!;

    if (!isGroup(msg)) {
      await sendReply(ctx, "Comando Exclusivo Para Grupos.", msg);
      return;
    }

    if (!(await isAdmin(ctx, msg))) {
      await sendReply(ctx, "Comando Exclusivo Para Admins Do Grupo", msg);
      return;
    }

    if (!(await isBotAdmin(ctx, msg))) {
      await sendReply(ctx, "O Bot Precisa Ser Admin Do Grupo.", msg);
      return;
    }

    const opt = args?.join(" ");

    if (opt === "fechar") {
      await ctx.socket.groupSettingUpdate(jid, "announcement");
    } else if (opt === "abrir") {
      await ctx.socket.groupSettingUpdate(jid, "not_announcement");
    } else {
      await sendReply(ctx, "Exemplo :grupo fechar ou :grupo abrir", msg);
      return;
    }
  }
}

export default groupSettings;
