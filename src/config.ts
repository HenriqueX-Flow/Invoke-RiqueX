import fs from "fs";
import Jimp from "jimp";

// Configurações do bot
export const config = {
  ownerName: "HenriqueX",
  ownerNumber: ["558888205721@s.whatsapp.net"],
  botName: "Invoke RiqueX",
  prefix: ":",
  listv: [
    "•","●","■","✿","▲","➩","➢","➣","➤","✦","✧",
    "△","❀","○","□","♤","♡","◇","♧","々","〆",
  ],
  reacts: ["💀","👍","⚙️","🤖","💭","☕","😘","💔","✅"],
  connectionMethod: "code",
  phoneNumber: "558896110835",
};

// Arquivos fixos do bot
export const generate = {
  thumb: fs.readFileSync("./media/doc.jpg"),
  doc: fs.readFileSync("./media/menu.pdf"),
};

// Função para redimensionar imagens
export const reSize = async (
  image: string | Buffer | ArrayBuffer,
  width = 100,
  height = 100
): Promise<Buffer> => {
  // converte ArrayBuffer para Buffer
  let input: string | Buffer;
  if (image instanceof ArrayBuffer) {
    input = Buffer.from(image);
  } else {
    input = image as string | Buffer;
  }

  const read = await Jimp.read(input as any); // força tipo compatível
  await read.resize(width, height);
  return read.getBufferAsync(Jimp.MIME_JPEG);
};