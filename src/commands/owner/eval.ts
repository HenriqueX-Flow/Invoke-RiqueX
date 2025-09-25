import { ICommand } from "../../common/interface";
import { isOwner, sendReply } from "../../common/utils/message";

const evalCmd: ICommand = {
  name: "eval",
  help: "(code)",
  category: "criador",
  async execute(ctx, msg, args) {
    const jid = msg.key.remoteJid!;
    
    if (!isOwner(msg)) {
      await sendReply(ctx, "Comando Exclusivo Para O Criador", msg);
      return;
    }

    const code = args.join(" ");
    if (!code) {
      await ctx.socket.sendMessage(jid, { text: "Digite O Código Para Executar." });
      return;
    }

    try {
      let result = await eval(`(async () => { ${code} })()`);
      if (typeof result !== "string") result = JSON.stringify(result, null, 2);

      await ctx.socket.sendMessage(jid, { text: "Resultado:\n```" + result + "```" });
    } catch (err: any) {
      await ctx.socket.sendMessage(jid, { text: "Erro:\n```" + err.message + "```" });
    }
  }
};

export default evalCmd;
