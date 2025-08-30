import fs from "fs";
import { ICommand } from "../Common/types";
import { sendListMsg } from "../Utils/flowInfo";

const test: ICommand = {
  name: "flow",
  help: "",
  category: "geral",
  async run(ctx, msg) {
    const jid = msg.key.remoteJid!;
    const client = ctx.sock
      await sendListMsg(client, jid, {
      text: "Escolha Um Menu",
      media: { image: fs.readFileSync("./media/header.jpg") },
      footer: "HenriqueX",
      title: "Invoke RiqueX",
      subtitle: "HenriqueX - Invoke RiqueX",
      quoted: msg,
      buttons: [
        {
          name: "single_select",
          buttonParamsJson: {
            title: "Menus",
            sections: [{
              title: "Categoria",
              rows: [
                { title: "Confi", id: "config" },
                { title: "Jogos", id: "game" },
              ],
            }]
          }
        }
      ],
      contextInfo: {
        isForwarded: true,
        isQuestion: true,
        forwardingScore: 245
      }
    })
  },
}

export default test;
