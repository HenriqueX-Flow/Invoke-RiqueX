import { Bot } from "./Common/bot";
import registerMessage from "./Events/message";
import registerConnection from "./Events/connection";
import registerGroup from "./Events/group";

async function main() {
  const bot = new Bot();

  /** Eventos */
  registerMessage(bot);
  registerConnection(bot);
  registerGroup(bot);

  await bot.start();
}

main();
