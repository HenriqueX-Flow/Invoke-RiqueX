import { downloadMediaMessage, proto, WAMessage } from "baileys";
import { BotContext } from "../Common/types";

export async function sendMsg(
  ctx: BotContext,
  jid: string,
  text: string,
  msg: proto.IWebMessageInfo,
) {
  await ctx.sock.sendMessage(jid, { text }, { quoted: msg });
}

export function isImage(msg: WAMessage): boolean {
  return (
    !!msg.message?.imageMessage ||
    !!msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage
  );
}

export function isVideo(msg: WAMessage): boolean {
  return ( !!msg.message?.imageMessage || !!msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage)
}

/**
 * Faz download da mídia da mensagem ou da mensagem citada
 */
export async function downloadMedia(msg: WAMessage): Promise<Buffer | null> {
  let targetMsg: WAMessage = msg;

  // Se a mensagem for citação e tiver mídia, usa ela
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  if (quoted?.imageMessage || quoted?.videoMessage) {
    targetMsg = { key: msg.key, message: quoted } as WAMessage;
  }

  try {
    const buffer = await downloadMediaMessage(targetMsg, "buffer", {});
    return buffer as Buffer;
  } catch (e) {
    console.error("Erro ao baixar mídia:", e);
    return null;
  }
}
