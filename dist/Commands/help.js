"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Help = {
    name: "help",
    description: "Mostra A Lista De Comandos",
    category: "general",
    async run(ctx, msg) {
        const jid = msg.key.remoteJid;
        const bot = ctx.bot;
        const grouped = {};
        for (const cmd of new Set(bot.commands.values())) {
            if (!grouped[cmd.category])
                grouped[cmd.category] = [];
            grouped[cmd.category].push(cmd);
        }
        let helpText = "Lista De Comandos:\n\n";
        for (const category of Object.keys(grouped)) {
            helpText += `*${category.toUpperCase()}*\n`;
            for (const cmd of grouped[category]) {
                const aliasText = cmd.aliases ? ` (aliases: ${cmd.aliases.map(a => ":" + a).join(", ")})` : "";
                helpText = `• :${cmd.name}${aliasText} - ${cmd.description}\n`;
            }
            helpText += "\n";
        }
        await ctx.sock.sendMessage(jid, {
            text: helpText
        }, { quoted: msg });
    }
};
exports.default = Help;
