"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("./Common/bot");
const message_1 = __importDefault(require("./Events/message"));
const connection_1 = __importDefault(require("./Events/connection"));
const group_1 = __importDefault(require("./Events/group"));
const logger_1 = __importDefault(require("./Middlewares/logger"));
const antiflood_1 = __importDefault(require("./Middlewares/antiflood"));
const adminOnly_1 = __importDefault(require("./Middlewares/adminOnly"));
async function main() {
    const bot = new bot_1.Bot();
    /** Middlewares Globais */
    bot.middlewares.use(logger_1.default);
    bot.middlewares.use(antiflood_1.default);
    bot.middlewares.use(adminOnly_1.default);
    /** Eventos */
    (0, message_1.default)(bot);
    (0, connection_1.default)(bot);
    (0, group_1.default)(bot);
    await bot.start();
}
main();
