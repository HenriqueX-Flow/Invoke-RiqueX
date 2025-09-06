import fs from "fs";
import path from "path";
import { ICommand } from "./interface";

export function loadCommands(): Map<string, ICommand> {
  const commands = new Map<string, ICommand>();
  const dir = path.join(__dirname, "..", "commands");

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".ts") && !file.endsWith(".js"))
      continue;

    const cmd: ICommand = require(path.join(dir, file)).default;

    commands.set(cmd.name, cmd);

    if (cmd.aliases) {
      for (const alias of cmd.aliases) {
        commands.set(alias, cmd);
      }
    }
  }

  return commands;
}
