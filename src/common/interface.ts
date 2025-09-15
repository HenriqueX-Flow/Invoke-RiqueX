import { WAMessage, WASocket } from "baileys-mod";
import { InvokeRiqueX } from "./bot";

export interface IBotContext {
  socket: WASocket;
}

export interface IBotEvents {
  message: {
    ctx: IBotContext;
    msg: WAMessage;
  };
  connection: {
    ctx: IBotContext;
    status: string;
  };
  group: {
    ctx: IBotContext;
    action: string;
    jid: string;
  };
}

export interface ICommand {
  name: string;
  help?: string;
  category: "admins" | "geral" | "criador" | "basicos" | "ferramentas";
  aliases?: string[];
  intro?: boolean;
  usage?: string;
  execute: (
    ctx: IBotContext,
    msg: WAMessage,
    args: string[],
    bot: InvokeRiqueX,
  ) => Promise<void>;
}
