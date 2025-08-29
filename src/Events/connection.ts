import { Consolefy, Colors } from "@mengkodingan/consolefy";
import { Bot } from "../Common/bot";

const consolefy = new Consolefy({
  prefixes: {
    info: "EVENTO"
  },
  theme: {
    info: (text) => Colors.bgGreen(Colors.black(text))
  },
  format: "{prefix}{tag} {message}",
  tag: "APP"
});

export default function register(bot: Bot) {
  bot.on("connection", ({ status }) => {
    const text = `STATUS DA CONEXÃO: ${(status || "DESCONHECIDO").toString().toUpperCase()}`;
    consolefy.info(text);
  });
}