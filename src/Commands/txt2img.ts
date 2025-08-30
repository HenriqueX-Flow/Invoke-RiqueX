import { ICommand } from "../Common/types";
import { Scraper } from "../Lib/scraper";
import { sendReply } from "../Utils/message";

const Txt2Image: ICommand = {
  name: "gerarimagem",
  help: "*<prompt>*",
  category: "geral",
  aliases: ["imagine"],
  async run(ctx, msg, args) {
    const jid = msg.key.remoteJid!;
    const prompt = args.join(" ");

    if (!prompt) {
      await sendReply(ctx, "Coloque O Texto Para Gerar A Imagem.", msg);
      return;
    }

    const result = await Scraper.txt2img(prompt) as {
      success: boolean;
      images: (string | { url: string })[];
    };

    if (!result.success || !result.images || result.images.length === 0) {
      await sendReply(ctx, "Erro Inesperado Ao Gerar A Imagem.", msg);
      return;
    }

    const randomIndex = Math.floor(Math.random() * result.images.length);
    const selectedImage = result.images[randomIndex] as string | { url: string };

    let media: any;

    if (typeof selectedImage === "string") {
      if (selectedImage.startsWith("data:image")) {
        const base64Data = selectedImage.split(",")[1];
        media = Buffer.from(base64Data, "base64");
      } else {
        media = { url: selectedImage };
      }
    } else if (selectedImage && typeof selectedImage === "object" && "url" in selectedImage) {

      media = { url: selectedImage.url };
    } else {
      await sendReply(ctx, "Erro: Formato De Imagem Inválido.", msg);
      return;
    }

    await ctx.sock.sendMessage(jid, {
      image: media,
      caption: `Prompt: *${prompt}*, A Imagem É Geradas Por IA E Pode Conter Erros.`,
    }, { quoted: msg });
  },
};

export default Txt2Image;
