import { Consolefy } from "@mengkodingan/consolefy";
import { Bot } from "../Common/bot"

export default function register(bot: Bot) {
  bot.on("message", async ({ ctx, msg }) => {
    if (!msg.message)
      return;

    const text = msg.message.conversation || msg.message?.extendedTextMessage?.text;
    if (!text || !text.startsWith(bot.prefix))
      return;

    const args = text.slice(bot.prefix.length).trim().split(/ +/);
    const cmdName = args.shift()?.toLowerCase();
    if (!cmdName)
      return;

    const cmd = bot.commands.get(cmdName);
    if (cmd) {
      try {
        (ctx as any).bot = bot;
        await cmd.run(ctx, msg, args);
      } catch (e) {
        console.log(e);
      }
    }
  });
}
