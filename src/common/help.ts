import fs from "fs";
import path from "path";
import { ICommand } from "./interface";

type SeenHelp = {
  [userId: string]: string[];
};

const dbPath = path.join(__dirname, "..", "..", "data", "db.json");

function loadDB(): SeenHelp {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

function saveDB(data: SeenHelp) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

let seenHelp: SeenHelp = loadDB();

export function shouldShowHelp(user: string, command: ICommand): boolean {
  if (!seenHelp[user]) seenHelp[user] = [];

  if (!seenHelp[user].includes(command.name)) {
    seenHelp[user].push(command.name);
    saveDB(seenHelp);
    return true;
  }
  return false;
}

export function getCommandIntro(command: ICommand): string {
  return `*Introdução Ao Comando :${command.name}*\n
*Nome:* ${command.name}
*Categoria:* ${command.category}
*Ajuda:* ${command.help || "(Sem Descrição)"}
*Aliases:* ${command.aliases?.join(", ") || "(Nenhum)"}\n

Como Usar:
  \`${command.usage || "Não Especificado"}\`\n

Você Pode Ver Esta Mensagem De Ajuda Novamente com: *:help ${command.name}*`;
}

