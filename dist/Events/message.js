"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = register;
function register(bot) {
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
                ctx.bot = bot;
                await cmd.run(ctx, msg, args);
            }
            catch (e) {
                console.log(e);
            }
        }
    });
}
