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

export async function sendReply(
  ctx: BotContext,
  text: string,
  msg: proto.IWebMessageInfo
) {
  const jid = msg.key.remoteJid!;
  await ctx.sock.sendMessage(
    jid,
    {
      text,
      contextInfo: {
        isForwarded: true,
        forwardingScore: 245,
        externalAdReply: {
          mediaUrl: "https://github.com/HenriqueX-Flow",
          mediaType: 2,
          //@ts-ignore
          previewType: "pdf",
          title: "Invoke RiqueX",
          body: "© HenriqueX",
          thumbnailUrl: "https://files.catbox.moe/y12axo.png",
          sourceUrl: "https://github.com/HenriqueX-Flow",
        }
      }
    },
    { quoted: msg }
  );
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

export function getSender(msg: any) {
  return msg.key.participant || msg.key.remoteJid;
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
