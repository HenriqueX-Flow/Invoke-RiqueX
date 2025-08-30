import cp from "child_process";
import { promisify } from "util";
import { ICommand } from "../Common/types";
import { getSender, sendReply } from "../Utils/message";

const exec = promisify(cp.exec).bind(cp);
const OWNER_JID = "558888205721@s.whatsapp.net";

const Exec: ICommand = {
  name: "exec",
  help: "*<cmd>*",
  category: "criador",
  async run(ctx, msg, args) {
    const jid = msg.key.remoteJid!;
    const sender = getSender(msg);

    if (sender !== OWNER_JID) {
      await ctx.sock.sendMessage(jid, {
        text: "Somente O Criador Pode Usar"
      });
      return;
    }

    const cmd = args?.join(" ");
    if (!cmd) {
      await sendReply(ctx, "Digite Um Comando Para Executar", msg);
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
        await ctx.sock.sendMessage(jid, {
          text: "SAÍDA:\n" + stdout.slice(0, 4000)
        });
      }

      if (stderr) {
        await ctx.sock.sendMessage(jid, {
          text: "Erro:\n" + stderr.slice(0, 4000)
        });
      }
    }
  },
};

export default Exec;
