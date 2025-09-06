import { ICommand } from "../common/interface";

const TesteCmd: ICommand = {
  name: "teste",
  category: "geral",
  async execute(ctx, msg) {
    const jid = msg.key.remoteJid!;

    let text = "Oi";
    await ctx.socket.sendMessage(jid, {
      text: text
    }, { quoted: msg });
  }
}

export default TesteCmd;
