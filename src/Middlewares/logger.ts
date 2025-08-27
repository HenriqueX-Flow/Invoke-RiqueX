import chalk from "chalk";
import { Middleware } from "../Common/middleware";

const logger: Middleware = async ({ msg, command, args, next }) => {
  const from = msg.key.remoteJid;
  console.log(chalk(`[!] ${from} Executou !${command.name} ${args.join(" ")}`));
  await next();
}

export default logger;
