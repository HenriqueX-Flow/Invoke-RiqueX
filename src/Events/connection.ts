import { Consolefy } from "@mengkodingan/consolefy";
import { Bot } from "../Common/bot";

const consolefy = new Consolefy

export default function register(bot: Bot) {
  bot.on("connection", ({ status }) => {
    consolefy.info("Status Da Conexão:", status);
  });
}
