import { ICommand } from "../Common/types";
import { Scraper } from "../Lib/scraper";
import { sendReply } from "../Utils/message";

const GerarNick: ICommand = {
  name: "gerarnick",
  description: "Monta uma lista de nicks estilizados",
  category: "basicos",
  aliases: ["nicks"],
  async run(ctx, msg, args) {
    const jid = msg.key.remoteJid!;
    const text = args?.join(" ");

    if (!text) {
      await sendReply(ctx, "Digite um texto após o comando", msg);
      return;
    }

    const styleToSend = await Scraper.style(text);

    // Monta tudo em uma string única
    const lista = styleToSend
      .map((e, i) => `*${i + 1}.* ${e.name}: ${e.result}`)
      .join("\n");

    // Envia em uma única mensagem
    await ctx.sock.sendMessage(jid, {
      text: `✨ *Nicks Gerados para:* ${text}\n\n${lista}`,
    });
  },
};

export default GerarNick;