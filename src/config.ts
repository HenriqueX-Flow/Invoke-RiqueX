import fs from "fs";

export const config = {
  ownerName: "HenriqueX",
  ownerNumber: ["558888205721@s.whatsapp.net"],
  botName: "Invoke RiqueX",
  prefix: ":",
  listv: ['•','●','■','✿','▲','➩','➢','➣','➤','✦','✧','△','❀','○','□','♤','♡','◇','♧','々','〆'],
  reacts: ["💀", "👍", "⚙️", "🤖", "💭", "☕", "😘", "💔", "✅"]
};

export const generate = {
  thumb: fs.readFileSync("./media/doc.jpg"),
  doc: fs.readFileSync("./media/menu.pdf")
}
