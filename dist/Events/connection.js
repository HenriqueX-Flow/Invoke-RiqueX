"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = register;
const consolefy_1 = require("@mengkodingan/consolefy");
const consolefy = new consolefy_1.Consolefy;
function register(bot) {
    bot.on("connection", ({ status }) => {
        consolefy.info("Status Da Conexão:", status);
    });
}
