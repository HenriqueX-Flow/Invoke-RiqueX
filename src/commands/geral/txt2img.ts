import { ICommand } from "../../common/interface";
import { sendReply } from "../../common/utils/message";
import { Scraper } from "../../common/utils/scraper";
import { reSize } from "../../config";

const textToImage: ICommand = {
  name: "imagine",
  help: "(prompt)",
  category: "geral",
  aliases: ["txttoimg", "txttoimage"],
  usage: ":imagine Uma Gato Na Estrada",
  async execute(ctx, msg, args) {
    const jid = msg.key.remoteJid!;
    const user = msg.pushName || "Invoke RiqueX";
    const prompt = args.join(" ");

    if (!prompt) {
      await sendReply(ctx, "Coloque O Texto Após O Comandos.", msg);
      return;
    }

    const result = (await Scraper.txt2image(prompt)) as {
      success: boolean;
      images: (string | { url: string })[];
    };

    if (!result.success || !result.images || result.images.length === 0) {
      await sendReply(ctx, "Ocorreu Um Erro Inesperado.", msg);
      return;
    }

    const randomIndex = Math.floor(Math.random() * result.images.length);
    const selectedImage = result.images[randomIndex] as
      | string
      | { url: string };
    let media: any;

    if (typeof selectedImage === "string") {
      if (selectedImage.startsWith("data.image")) {
        const base64Data = selectedImage.split(",")[1];
        media = Buffer.from(base64Data, "base64");
      } else {
        media = { url: selectedImage };
      }
    } else if (
      selectedImage &&
      typeof selectedImage === "object" &&
      "url" in selectedImage
    ) {
      media = { url: selectedImage.url };
    } else {
      await sendReply(ctx, "Ocorreu Um Erro No Envio Da Imagem", msg);
      return;
    }

    await ctx.socket.sendMessage(
      jid,
      {
        image: media,
      },
      { quoted: msg },
    );
  },
};

export default textToImage;
