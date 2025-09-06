import { WAMessage, WASocket } from "baileys";

export interface IBotContext {
  socket: WASocket;
}

export interface IBotEvents {
  message: {
    ctx: IBotContext;
    msg: WAMessage
  };
  connection: {
    ctx: IBotContext;
    status: string
  };
  group: {
    ctx: IBotContext;
    action: string;
    jid: string
  };
}

export interface ICommand {
  name: string;
  help?: string;
  category: "admins" | "geral" | "criador" | "basicos";
  aliases?: string[];
  execute: (ctx: IBotContext, msg: WAMessage, args: string[]) => Promise<void>;
}
