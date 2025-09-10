import fs from "fs";
import path from "path";
import { ICommand } from "./interface";

const commands = new Map<string, ICommand>();
const baseDir = path.join(__dirname, "..", "commands");

export function loadCommands(): Map<string, ICommand> {
  commands.clear();
  loadFromDir(baseDir);

  console.log("✅ Comandos carregados:");
  for (const [name, cmd] of commands.entries()) {
    if (cmd.name === name) {
      const aliases = cmd.aliases?.length
        ? ` (aliases: ${cmd.aliases.join(", ")})`
        : "";
      console.log(`  • ${cmd.name}${aliases}`);
    }
  }
  console.log(`🔹 Total: ${new Set([...commands.values()]).size} comandos`);

  return commands;
}

function loadFromDir(dir: string) {
  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith(".bak") || file.endsWith(".d.ts")) continue; // ignora lixos

    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      loadFromDir(fullPath);
    } else if (file.endsWith(".ts") || file.endsWith(".js")) {
      loadCommand(fullPath);
    }
  }
}

function loadCommand(file: string) {
  try {
    delete require.cache[require.resolve(file)]; // limpa cache para hot reload
    const mod = require(file);
    if (mod?.default) registerCommand(mod.default);
  } catch (err) {
    console.warn(`⚠️ Falha ao carregar comando: ${file}`, err);
  }
}

function registerCommand(cmd: ICommand) {
  if (!cmd?.name) return;
  commands.set(cmd.name, cmd);
  if (cmd.aliases) {
    for (const alias of cmd.aliases) {
      commands.set(alias, cmd);
    }
  }
}

// --- HOT RELOAD ---
fs.watch(baseDir, { recursive: true }, (event, filename) => {
  if (!filename) return;
  if (!filename.endsWith(".ts") && !filename.endsWith(".js")) return;
  if (filename.endsWith(".bak") || filename.endsWith(".d.ts")) return;

  const changedFile = path.join(baseDir, filename);
  console.log(`♻️ Alteração detectada em: ${filename}`);
  loadCommand(changedFile);
});