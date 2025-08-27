import { Bot } from "./Common/bot";
import registerMessage from "./Events/message";
import registerConnection from "./Events/connection";
import registerGroup from "./Events/group";

import logger from "./Middlewares/logger";
import antiflood from "./Middlewares/antiflood";
import adminOnly from "./Middlewares/adminOnly";

async function main() {
  const bot = new Bot();
  /** Middlewares Globais */
  bot.middlewares.use(logger);
  bot.middlewares.use(antiflood);
  bot.middlewares.use(adminOnly);

  /** Eventos */
  registerMessage(bot);
  registerConnection(bot);
  registerGroup(bot);

  await bot.start();
}

main();
