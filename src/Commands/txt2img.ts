import { ICommand } from "../Common/types";
import { Scraper } from "../Lib/scraper";
import { sendReply } from "../Utils/message";

const Txt2Image: ICommand = {
  name: "gerarimagem",
  description: "Gere Uma Imagem Com IA",
  category: "geral",
  aliases: ["imagine"],
  async run(ctx, msg, args, text) {
    const jid = msg.key.remoteJid!;
    const prompt = args.join(" ");

    if (!prompt) {
      await sendReply(ctx, "Coloque o texto para gerar a imagem.", msg);
      return;
    }

    const result = await Scraper.txt2img(prompt);

    if (!result.success || !result.images || result.images.length === 0) {
      await sendReply(ctx, "Erro inesperado ao gerar a imagem.", msg);
      return;
    }

    // Pega uma imagem aleatória se houver mais de uma
    const randomIndex = Math.floor(Math.random() * result.images.length);
    const selectedImage = result.images[randomIndex];

    let media: any;

    if (typeof selectedImage === "string") {
      // Base64 ou URL
      if (selectedImage.startsWith("data:image")) {
        const base64Data = selectedImage.split(",")[1];
        media = Buffer.from(base64Data, "base64");
      } else {
        media = { url: selectedImage };
      }
    } else if (selectedImage && typeof selectedImage === "object" && selectedImage.url) {
      // Objeto com url
      media = { url: selectedImage.url };
    } else {
      await sendReply(ctx, "Erro: formato de imagem inválido.", msg);
      return;
    }

    await ctx.sock.sendMessage(jid, {
      image: media,
      caption: `Prompt: ${prompt}`,
    }, { quoted: msg });
  },
};

export default Txt2Image;