"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = require("../Utils/message");
const sticker_1 = require("../Utils/sticker");
const StickerCmd = {
    name: "sticker",
    description: "Transforma Uma Imagem ou Vídeo Em Figurinha.",
    category: "fun",
    aliases: ["s"],
    async run(ctx, msg) {
        const jid = msg.key.remoteJid;
        if (!(0, message_1.isImage)(msg) && !(0, message_1.isVideo)(msg)) {
            await ctx.sock.sendMessage(jid, { text: "Marque uma imagem ou vídeo de até 10s." });
            return;
        }
        const buffer = await (0, message_1.downloadMedia)(msg);
        if (!buffer) {
            await ctx.sock.sendMessage(jid, { text: "Erro ao baixar mídia." });
            return;
        }
        try {
            let webp;
            if ((0, message_1.isImage)(msg)) {
                webp = await (0, sticker_1.imageToWeb)(buffer);
            }
            else {
                webp = await (0, sticker_1.videoToWeb)(buffer);
            }
            await ctx.sock.sendMessage(jid, { sticker: webp });
        }
        catch (e) {
            console.error("Erro ao converter para sticker:", e);
            await ctx.sock.sendMessage(jid, { text: "Falha ao criar figurinha." });
        }
    }
};
exports.default = StickerCmd;
