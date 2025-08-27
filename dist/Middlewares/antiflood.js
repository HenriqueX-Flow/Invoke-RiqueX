"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consolefy_1 = require("@mengkodingan/consolefy");
const cooldown = new Map();
const DELAY = 1000; // 3s Entre Comandos.
const consolefy = new consolefy_1.Consolefy();
const antiflood = async ({ msg, next }) => {
    const user = msg.key.participant || msg.key.remoteJid;
    const now = Date.now();
    if (cooldown.has(user) && now - cooldown.get(user) < DELAY) {
        consolefy.info(`Flood, Ignorando Mensagem De ${user}`);
        return; /** Não Chama O next() Bloqueia */
    }
    cooldown.set(user, now);
    await next();
};
exports.default = antiflood;
