import chalk from "chalk";
import { Middleware } from "../Common/middleware";
import { Consolefy } from "@mengkodingan/consolefy";
import { info } from "console";

const cooldown = new Map<string, number>();
const DELAY = 1000; // 3s Entre Comandos.
const consolefy = new Consolefy();

const antiflood: Middleware = async ({ msg, next }) => {
  const user = msg.key.participant || msg.key.remoteJid!;
  const now = Date.now();

  if (cooldown.has(user) && now - cooldown.get(user)! < DELAY) {
    consolefy.info(`Flood, Ignorando Mensagem De ${user}`);
    return; /** Não Chama O next() Bloqueia */
  }

  cooldown.set(user, now);
  await next();
};

export default antiflood;
