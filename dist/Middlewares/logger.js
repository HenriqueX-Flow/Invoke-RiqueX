"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const logger = async ({ msg, command, args, next }) => {
    const from = msg.key.remoteJid;
    console.log((0, chalk_1.default)(`[!] ${from} Executou !${command.name} ${args.join(" ")}`));
    await next();
};
exports.default = logger;
