import { ICommand } from "../../common/interface";
import { Scraper } from "../../common/utils/scraper";
import { sendReply } from "../../common/utils/message";

const nickname: ICommand = {
  name: "nick",
  help: "<texto>",
  category: "geral",
  aliases: ["gerarnick", "nome", "nickname"],
  async execute(ctx, msg, args) {
    const prompt = args?.join(" ");

    if (!prompt) {
      await sendReply(ctx, "Digite O Nome Após O Comando.", msg);
      return;
    }

    const styleToSend = await Scraper.style(prompt);
    const list = styleToSend
      .map((e, i) => `*${i + 1}.* ${e.name}: ${e.result}`)
      .join("\n");

    await sendReply(ctx, `Nicks Gerados Para: *${prompt}*\n\n${list}`, msg);
  },
};

export default nickname;
