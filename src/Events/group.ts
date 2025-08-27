import { Bot } from "../Common/bot";

export default function register(bot: Bot) {
  bot.on("group", ({ action, jid }) => {
    console.log(`Evento De Grupo: ${action} Em ${jid}`)
  });
}
