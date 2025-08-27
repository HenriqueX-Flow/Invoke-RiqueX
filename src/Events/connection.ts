import { Bot } from "../Common/bot";

export default function register(bot: Bot) {
  bot.on("connection", ({ status }) => {
    console.log("Status Da Conexão:", status);
  });
}
