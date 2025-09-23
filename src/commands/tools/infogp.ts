import { ICommand } from "../../common/interface";
import { isGroup, sendReply } from "../../common/utils/message";

const infogp: ICommand = {
  name: "infogp",
  help: "",
  category: "ferramentas",
  aliases: ["groupinfo", "gpinfo"],
  usage: ":infogp (sem args no grupo) ou :infogp linkdogrupo no PV",
  async execute(ctx, msg) {
    const jid = msg.key.remoteJid!;

    if (!isGroup(msg)) {
      await sendReply(ctx, "Comando Exclusivo Para Grupos", msg);
      return;
    }

    try {
      const metadata = await ctx.socket.groupMetadata(jid);
      const subject = metadata.subject || "-"
      const desc = metadata.desc?.toString() || "Sem Descrição"
      const owner = metadata.owner || "Desconhecido"
      const partcipants = (metadata.participants || []).length;

      let ppUrl: any;
      try {
        ppUrl = await ctx.socket.profilePictureUrl(jid, "image");
      } catch (e) {
        ppUrl = null;
      }

      if (!ppUrl) {
        await ctx.socket.sendMessage(jid, {
          text: "O Grupo Não Possui Foto"
        }, { quoted: msg });
      }

      const res = await fetch(ppUrl);
      if (!res.ok) throw new Error("Falha Ao Baixar A Imagem Do Grupo");
    const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const caption = [
        `*Grupo* : ${subject}`,
        `*Descrição* : ${desc}`,
        `*Dono* : @${owner.split("@")[0]}`,
        `*Participantes* : ${partcipants}`,
        `*Id* : ${jid}`,
        `link: ${metadata.inviteCode?.toString() || "Não Conseguir Obter"}`
      ].join("\n");

      await ctx.socket.sendMessage(jid, {
        image: buffer,
        caption
      }, { quoted: msg });
    } catch (e: any) {
      console.log(e);
    }
  },
};

export default infogp;
