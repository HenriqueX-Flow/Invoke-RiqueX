import { 
  WAMessage, 
  WASocket 
} from "baileys";

export interface BotContext {
  sock: WASocket;
}

export interface BotEvents {
  message: { ctx: BotContext; msg: WAMessage };
  connection: { ctx: BotContext; status: string };
  group: { ctx: BotContext; action: string; jid: string };
}

export interface ICommand {
  name: string;
  description: string;
  run: (ctx: BotContext, msg: WAMessage, args: string[]) => Promise<void>;
}
