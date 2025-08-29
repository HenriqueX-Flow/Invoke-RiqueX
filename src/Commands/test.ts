import { title } from "process";
import { ICommand } from "../Common/types";
import { sendListMsg } from "../Utils/flowInfo";

const test: ICommand = {
  name: "flow",
  description: "test",
  category: "geral",
  async run(ctx, msg) {
    const jid = msg.key.remoteJid!;
    const client = ctx.sock
      await sendListMsg(client, jid, {
      text: "Esse É Um Teste De Botões Usando A Baileys Oficial, Talvez A Mensagem Não Seja Enviada Em Grupos.",
      footer: "HenriqueX",
      title: "Invoke RiqueX",
      subtitle: "HenriqueX - Invoke RiqueX",
      buttons: [
        {
          name: "single_select",
          buttonParamsJson: {
            title: "Menus",
            sections: [{
              title: "Categoria",
              rows: [
                { title: "Isso É Apenas Um Teste", id: "teste" },
                { title: "Isso É Apenas Um Teste", id: "teste" },
              ],
            }]
          }
        }
      ]
    })
  },
}

export default test;
