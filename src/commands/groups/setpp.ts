import { ICommand } from "../../common/interface";
import {
  downloadMedia,
  isAdmin,
  isBotAdmin,
  isGroup,
  isImage,
  sendReply,
} from "../../common/utils/message";

const setppGroup: ICommand = {
  name: "setppgp",
  help: "(imagem)",
  category: "admins",
  aliases: ["fotogrupo"],
  usage: "Marque Uma Imagem Com :setppgp E Essa Imagem Será O Perfil Do Grupo.",
  async execute(ctx, msg) {
    const jid = msg.key.remoteJid!;

    if (!isGroup(msg)) {
      await sendReply(ctx, "Comando Exclusivo Para Grupos", msg);
      return;
    }

    if (!(await isAdmin(ctx, msg))) {
      await sendReply(ctx, "Comando Exclusivo Para Admins.", msg);
      return;
    }

    if (!(await isBotAdmin(ctx, msg))) {
      await sendReply(ctx, "O Bot Precisa Ser Admin Do Grupo.", msg);
      return;
    }

    if (!isImage(msg)) {
      await sendReply(ctx, "Marque Uma imagem Para O Perfil Do Grupo.", msg);
      return;
    }

    let img = await downloadMedia(msg);

    if (img) {
      await ctx.socket.updateProfilePicture(jid, img);
    } else if (!img) {
      await sendReply(ctx, "Não Conseguir Baixar A Imagem", msg);
      return;
    }
  },
};

export default setppGroup;
