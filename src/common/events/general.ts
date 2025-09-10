import { InvokeRiqueX } from "../bot";
import { Consolefy } from "@mengkodingan/consolefy";

const consolefy = new Consolefy();

export default function register(bot: InvokeRiqueX) {
  bot.on("connection", ({ status }) => {
    const text = `Status Da Conexão: ${status || "Desconhecido"}`
    console.log(text);
  });

  bot.on("group", ({ action, jid }) => {
    const text = `Evento Do Grupo: ${action} Em ${jid}`;
    console.log(text);
  });
}
