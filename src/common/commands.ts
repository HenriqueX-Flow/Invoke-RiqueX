import fs from "fs";
import path from "path";
import { ICommand } from "./interface";

export function loadCommands(): Map<string, ICommand> {
  const commands = new Map<string, ICommand>();
  const baseDir = path.join(__dirname, "..", "commands");

  function loadFromDir(dir: string) {
    for (const file of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // tenta carregar menu.ts, menu.js, index.ts, index.js dentro da pasta
        const possibleFiles = [
          path.join(fullPath, `${file}.ts`),
          path.join(fullPath, `${file}.js`),
          path.join(fullPath, "index.ts"),
          path.join(fullPath, "index.js"),
        ];

        let loaded = false;
        for (const f of possibleFiles) {
          if (fs.existsSync(f)) {
            try {
              const mod = require(f);
              if (mod?.default) {
                registerCommand(mod.default);
                loaded = true;
              }
            } catch (err) {
              console.warn(`⚠️ Falha ao carregar comando: ${f}`, err);
            }
            break;
          }
        }

        // percorre subpastas mesmo se não achou um arquivo válido
        if (!loaded) loadFromDir(fullPath);
      } else if (file.endsWith(".ts") || file.endsWith(".js")) {
        try {
          const mod = require(fullPath);
          if (mod?.default) {
            registerCommand(mod.default);
          }
        } catch (err) {
          console.warn(`⚠️ Falha ao carregar comando: ${fullPath}`, err);
        }
      }
    }
  }

  function registerCommand(cmd: ICommand) {
    if (!cmd?.name) return; // ignora se não tiver nome
    commands.set(cmd.name, cmd);
    if (cmd.aliases) {
      for (const alias of cmd.aliases) {
        commands.set(alias, cmd);
      }
    }
  }

  loadFromDir(baseDir);

  // log bonitinho
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
