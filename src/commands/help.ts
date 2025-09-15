import { ICommand } from "../common/interface";
import { getCommandIntro } from "../common/help";

const HelpCommand: ICommand = {
  name: "help",
  help: "<comando>",
  category: "geral",
  usage: ":help NomeDoComando",
  aliases: ["ajuda"],
  async execute(ctx, msg, args) {
    const jid = msg.key.remoteJid!;
    const cmdName = args[0]?.toLowerCase();

    if (!cmdName) {
      await ctx.socket.sendMessage(
        jid,
        { text: "Uso: :help <comando>" },
        { quoted: msg },
      );
      return;
    }

    const cmd = (ctx as any).bot.commands.get(cmdName);
    if (!cmd) {
      await ctx.socket.sendMessage(
        jid,
        { text: `Comando *${cmdName}* Não Encontrado.` },
        { quoted: msg },
      );
      return;
    }

    const intro = getCommandIntro(cmd);
    await ctx.socket.sendMessage(jid, { text: intro }, { quoted: msg });
  },
};

export default HelpCommand;

