import { ICommand } from "../../common/interface";
import { isOwner, sendReply } from "../../common/utils/message";

const botSettings: ICommand = {
  name: "config",
  help: "(opção)",
  category: "criador",
  usage: "':config opção on' Ou ':config opção off'",
  async execute(ctx, msg, args, bot) {
    if (!isOwner(msg)) {
      await sendReply(ctx, "Comando Exclusivo Para O Criador.", msg);
      return;
    }

    if (args.length < 1) {
      await sendReply(
        ctx,
        "Opções: autoread, autotyping, public, anticall",
        msg,
      );
      return;
    }

    const option = args[0].toLowerCase();

    let key: keyof (typeof bot.settings)["config"];
    switch (option) {
      case "autoread":
        key = "autoread";
        break;
      case "autotyping":
        key = "autotyping";
        break;
      case "public":
        key = "publicMode";
        break;
      case "anticall":
        key = "anticall";
        break;
      default:
        await sendReply(
          ctx,
          "Opção Que Você Pediu Talvez Não Existe, Exemplo Rápido *:config autoread on*",
          msg,
        );
        return;
    }

    const newValue = bot.settings.toggle(key);

    await sendReply(
      ctx,
      `${option.toUpperCase()} AGORA ESTA _*${newValue ? "ON" : "OFF"}*_`,
      msg,
    );
  },
};

export default botSettings;
