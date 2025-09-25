import { ICommand } from "../common/interface";
import { sendReply } from "../common/utils/message";

const deleteMsg: ICommand = {
  name: "deletar",
  help: "(msg)",
  category: "admins",
  aliases: ["deletar", "apagar"],
  usage: "Marque Uma Mensagem Com :deletar Para Apagar A Mensagem.",
  async execute(ctx, msg): Promise<void> {
    const jid = msg.key.remoteJid!;
    const contextInfo = msg.message?.extendedTextMessage?.contextInfo;

    if (!contextInfo?.stanzaId) {
      await sendReply(ctx, "Marque Uma Mensagem Para Apagar.", msg);
      return;
    }

    const stanzaId = contextInfo.stanzaId;
    const participant = contextInfo.participant || undefined;

    const botId = ctx.socket.user?.id;
    const botNumber = botId?.split(":")[0] + "@s.whatsapp.net";

    const isBotMessage = participant === botId || participant === botNumber;
    const isGroup = jid.endsWith("@g.us");

    let isBotAdmin = false;
    if (isGroup) {
      const groupMetadata = await ctx.socket.groupMetadata(jid);
      const meInGroup = groupMetadata.participants.find(p => p.id === botNumber);
      isBotAdmin = !!meInGroup && meInGroup.admin !== null;
    }

    if (isGroup) {
      if (isBotAdmin) {
        await ctx.socket.sendMessage(jid, {
          delete: {
            remoteJid: jid,
            fromMe: isBotMessage,
            id: stanzaId,
            participant,
          }
        });
      } else {
        await ctx.socket.sendMessage(jid, { text: "Preciso Ser Admin Para Apagar Mensagens No Grupo." }, { quoted: msg });
      }
    } else {
      if (isBotMessage) {
        await ctx.socket.sendMessage(jid, {
          delete: {
            remoteJid: jid,
            fromMe: true,
            id: stanzaId,
            participant,
          }
        });
      } else {
        await ctx.socket.sendMessage(jid, { text: "No Privado Só Consigo Apagar Minhas Próprias Mensagens." }, { quoted: msg });
      }
    }
  }
};

export default deleteMsg;
