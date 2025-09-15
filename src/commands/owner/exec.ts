import cp from "child_process";
import { promisify } from "util";
import { ICommand } from "../../common/interface";
import { isOwner, sendReply } from "../../common/utils/message";

const exec = promisify(cp.exec).bind(cp);

const execution: ICommand = {
  name: "exec",
  help: "<commando>",
  category: "criador",
  usage: "Execute Comandos No Terminal Exemplo :exec ls",
  async execute(ctx, msg, args) {
    const jid = msg.key.remoteJid!;

    if (!isOwner(msg)) {
      await sendReply(ctx, "Comando Exclusivo Para O Criador.", msg);
      return;
    }

    const cmd = args?.join(" ");
    if (!cmd) {
      await sendReply(ctx, "Digite Um Comando Para Executar.", msg);
      return;
    }

    let o;
    try {
      o = await exec(cmd, { timeout: 5000, maxBuffer: 1024 * 1024 });
    } catch (e: any) {
      o = e;
    } finally {
      const stdout = o.stdout ? o.stdout.toString().trim() : "";
      const stderr = o.stderr ? o.stderr.toString().trim() : "";

      if (stdout) {
        await ctx.socket.sendMessage(
          jid,
          {
            text: "Saída:\n" + stdout.slice(0, 4000),
          },
          { quoted: msg },
        );
      }

      if (stderr) {
        await ctx.socket.sendMessage(
          jid,
          {
            text: "Erro:\n" + stderr.slice(0, 4000),
          },
          { quoted: msg },
        );
      }
    }
  },
};

export default execution;
