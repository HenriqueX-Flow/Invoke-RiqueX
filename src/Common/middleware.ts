import { BotContext } from "./types";
import { WAMessage } from "baileys";
import { ICommand } from "./types";

export type Middleware = (opts: {
  ctx: BotContext;
  msg: WAMessage;
  command: ICommand;
  args: string[];
  next: () => Promise<void>;
}) => Promise<void> | void;

export class MiddlewareManager {
  private middlewares: Middleware[] = [];

  use(mw: Middleware) {
    this.middlewares.push(mw);
  }

  async run(
    ctx: BotContext,
    msg: WAMessage,
    command: ICommand,
    args: string[],
    fn: () => Promise<void>,
  ) {
    let i = -1;

    const runner = async (index: number): Promise<void> => {
      if (index <= i) throw new Error("next() Chamado Múltiplas Vezes");
      i = index;
      const mw = this.middlewares[index];
      if (mw) {
        await mw({ ctx, msg, command, args, next: () => runner(index + 1) });
      } else {
        await fn();
      }
    };

    await runner(0);
  }
}
