"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCommands = loadCommands;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function loadCommands() {
    const commands = new Map();
    const dir = path_1.default.join(__dirname, "..", "Commands");
    for (const file of fs_1.default.readdirSync(dir)) {
        if (!file.endsWith(".ts") && !file.endsWith(".js"))
            continue;
        const cmd = require(path_1.default.join(dir, file)).default;
        commands.set(cmd.name, cmd);
        if (cmd.aliases) {
            for (const alias of cmd.aliases) {
                commands.set(alias, cmd);
            }
        }
    }
    return commands;
}
