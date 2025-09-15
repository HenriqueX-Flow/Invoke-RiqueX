import fs from "fs";
import path from "path";
import { ICommand } from "../../common/interface";
import { isOwner, sendReply } from "../../common/utils/message";

const qaFile = path.join(process.cwd(), "data", "qa.json");

if (!fs.existsSync(qaFile)) {
  fs.writeFileSync(qaFile, JSON.stringify({}, null, 2));
}

const QACommand: ICommand = {
  name: "qa",
  help: "<add/list/remove>",
  category: "criador",
  aliases: ["resposta", "pergunta"],
  async execute(ctx, msg, args) {
    const qa = JSON.parse(fs.readFileSync(qaFile, "utf-8"));
    
    if (!isOwner(msg)) {
      await sendReply(ctx, "Somente O Criador", msg);
      return;
    }

    if (args.length === 0) {
      return sendReply(
        ctx,
        `Uso Do Comando:\n\n` +
          `:qa add <pergunta> | <resposta>\n` +
          `:qa remove <pergunta>\n` +
          `:qa list\n`,
        msg
      );
    }

    const subcmd = args[0].toLowerCase();

    if (subcmd === "add") {
      const joined = args.slice(1).join(" ");
      const [pergunta, resposta] = joined.split("|").map((s) => s.trim());

      if (!pergunta || !resposta) {
        return sendReply(ctx, "Formato Inválido.\nUse: :qa add <pergunta> | <resposta>", msg);
      }

      qa[pergunta.toLowerCase()] = resposta;
      fs.writeFileSync(qaFile, JSON.stringify(qa, null, 2));

      return sendReply(ctx, `Pergunta Adicionada:\n- *${pergunta}* → ${resposta}`, msg);
    }

    if (subcmd === "remove") {
      const pergunta = args.slice(1).join(" ").toLowerCase();
      if (!pergunta) return sendReply(ctx, "Especifique A Pergunta Para Remover.", msg);

      if (qa[pergunta]) {
        delete qa[pergunta];
        fs.writeFileSync(qaFile, JSON.stringify(qa, null, 2));
        return sendReply(ctx, `Pergunta Removida: *${pergunta}*`, msg);
      } else {
        return sendReply(ctx, "Essa Pergunta Não Existe No Banco De Dados.", msg);
      }
    }

    if (subcmd === "list") {
      const entries = Object.entries(qa);
      if (entries.length === 0) {
        return sendReply(ctx, "Nenhuma Pergunta Cadastrada Ainda.", msg);
      }

      let text = "*Lista De Perguntas/Respostas:*\n\n";
      for (const [pergunta, resposta] of entries) {
        text += `- *${pergunta}* → ${resposta}\n`;
      }

      return sendReply(ctx, text, msg);
    }

    return sendReply(ctx, "Subcomando Inválido. Use: add / remove / list", msg);
  },
};

export default QACommand;
