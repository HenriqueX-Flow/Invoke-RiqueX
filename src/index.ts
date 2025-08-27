import { Bot } from "./Common/bot";
import registerMessage from "./events/message";
import registerConnection from "./events/connection";
import registerGroup from "./events/group";

import logger from "./middlewares/logger";
import antiflood from "./middlewares/antiflood";
import adminOnly from "./middlewares/adminOnly";

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
