import fs from "fs";
import * as Jimp from "jimp";

export const config = {
  ownerName: "HenriqueX",
  ownerNumber: ["558888205721@s.whatsapp.net"],
  botName: "Invoke RiqueX",
  prefix: ":",
  listv: [
    "•",
    "●",
    "■",
    "✿",
    "▲",
    "➩",
    "➢",
    "➣",
    "➤",
    "✦",
    "✧",
    "△",
    "❀",
    "○",
    "□",
    "♤",
    "♡",
    "◇",
    "♧",
    "々",
    "〆",
  ],
  reacts: ["💀", "👍", "⚙️", "🤖", "💭", "☕", "😘", "💔", "✅"],
};

export const generate = {
  thumb: fs.readFileSync("./media/doc.jpg"),
  doc: fs.readFileSync("./media/menu.pdf"),
};

export const reSize = async (
  image: string,
  width = 100,
  height = 100,
): Promise<Buffer> => {
  // note o Jimp.Jimp.read
  const read = await Jimp.Jimp.read(image);
  return await read.resize({ w: width, h: height }).getBuffer("image/jpeg");
};

