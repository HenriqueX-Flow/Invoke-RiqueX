import { ICommand } from "../../common/interface";
import { sendReply } from "../../common/utils/message";

const viewLid: ICommand = {
  name: "getlid",
  help: "(@usuário)",
  category: "ferramentas",
  async execute(ctx, msg, args) {
    let user: string | undefined;

    if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
      user = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else {
      user = args?.join("")?.replace(/\D/g, "");
    }

    if (!user) {
      return sendReply(ctx, "Você Precisa Mencionar Ou Digitar Um Número.", msg);
    }

    try {
      const resultList = await ctx.socket.onWhatsApp(user);

      if (!resultList || resultList.length === 0) {
        return sendReply(ctx, "Número Não Encontrado No WhatsApp.", msg);
      }

      const result = resultList[0];
      const jid = result.jid;
      const lid = (result as any).lid ?? "Não Disponível";

      await sendReply(
        ctx,
        `*Resultado:*\n\n• Jid: ${jid}\n• Lid: ${lid}`, msg);
    } catch (err) {
      await sendReply(ctx, "Erro Ao Consultar O Número.", msg);
      console.error("Erro:", err);
    }
  },
};

export default viewLid;