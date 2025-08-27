import chalk from "chalk";
import { Middleware } from "../Common/middleware";

const cooldown = new Map<string, number>();
const DELAY = 3000; // 3s Entre Comandos.

const antiflood: Middleware = async ({ msg, next }) => {
  const user = msg.key.participant || msg.key.remoteJid!;
  const now = Date.now();

  if (cooldown.has(user) && now - cooldown.get(user)! < DELAY) {
    console.log(chalk.red(`[!] Flood, Ignorando Mensagem De ${user}`));
    return; /** Não Chama O next() Bloqueia */
  }

  cooldown.set(user, now);
  await next();
};

export default antiflood;
