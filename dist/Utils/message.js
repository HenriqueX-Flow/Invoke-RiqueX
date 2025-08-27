"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMsg = sendMsg;
exports.isImage = isImage;
exports.isVideo = isVideo;
exports.downloadMedia = downloadMedia;
const baileys_1 = require("baileys");
async function sendMsg(ctx, jid, text, msg) {
    await ctx.sock.sendMessage(jid, { text }, { quoted: msg });
}
function isImage(msg) {
    return (!!msg.message?.imageMessage ||
        !!msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage);
}
function isVideo(msg) {
    return (!!msg.message?.imageMessage || !!msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage);
}
/**
 * Faz download da mídia da mensagem ou da mensagem citada
 */
async function downloadMedia(msg) {
    let targetMsg = msg;
    // Se a mensagem for citação e tiver mídia, usa ela
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (quoted?.imageMessage || quoted?.videoMessage) {
        targetMsg = { key: msg.key, message: quoted };
    }
    try {
        const buffer = await (0, baileys_1.downloadMediaMessage)(targetMsg, "buffer", {});
        return buffer;
    }
    catch (e) {
        console.error("Erro ao baixar mídia:", e);
        return null;
    }
}
