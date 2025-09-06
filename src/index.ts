import { InvokeRiqueX } from "./common/bot";
import registerMessage from "./common/events/general";
import registerConnection from "./common/events/general";
import registerGroup from "./common/events/general";

async function main() {
  const bot = new InvokeRiqueX();

  await bot.start();

  registerMessage(bot);
  registerConnection(bot);
  registerGroup(bot);
  
}

main();
