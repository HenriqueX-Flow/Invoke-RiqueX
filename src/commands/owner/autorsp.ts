import fs from "fs";
import path from "path";
import { ICommand } from "../../common/interface";
import { isOwner, sendReply } from "../../common/utils/message";

const activeFile = path.join(process.cwd(), "data", "active.json");

const AutoRsp: ICommand = {
  name: "autorsp",
  help: "<on/off>",
  category: "criador",
  aliases: ["auto-resp", "ar"],
  async execute(ctx, msg, args) {
    if (!fs.existsSync(activeFile)) {
      fs.writeFileSync(activeFile, JSON.stringify({ autoresp: false }, null, 2));
    }

if (!isOwner(msg)) {
      await sendReply(ctx, "Somente O Criador", msg);
      return;
    }

    const data = JSON.parse(fs.readFileSync(activeFile, "utf-8"));

    if (args.length === 0) {
      return sendReply(
        ctx,
        `Uso Correto: :autorsp on / off\n\nStatus Atual: ${data.autoresp ? "✅ ligado" : "❌ desligado"}`,
        msg
      );
    }

    const option = args[0].toLowerCase();
    if (option === "on") {
      data.autoresp = true;
      fs.writeFileSync(activeFile, JSON.stringify(data, null, 2));
      return sendReply(ctx, "Auto Resposta Foi *Ativada*.", msg);
    } else if (option === "off") {
      data.autoresp = false;
      fs.writeFileSync(activeFile, JSON.stringify(data, null, 2));
      return sendReply(ctx, "Auto Resposta Foi *Desativada*.", msg);
    } else {
      return sendReply(ctx, "Opção Inválida. Use `on` Ou `off`.", msg);
    }
  },
};

export default AutoRsp;
