"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = register;
function register(bot) {
    bot.on("group", ({ action, jid }) => {
        console.log(`Evento De Grupo: ${action} Em ${jid}`);
    });
}
