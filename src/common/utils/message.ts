import { downloadMediaMessage, proto, WAMessage } from "baileys-mod";
import { IBotContext } from "../interface";
import { config } from "../../config";
import { fileTypeFromBuffer } from "file-type";
import axios from "axios";

/**
 * Faz download de URL -> Buffer
 */
async function getBuffer(media: Buffer | string): Promise<Buffer> {
  if (Buffer.isBuffer(media)) return media;
  const res = await axios.get(media, { responseType: "arraybuffer" });
  return Buffer.from(res.data);
}

/**
 * Envia mídia automaticamente (imagem, vídeo, áudio, sticker, documento...)
 * Detecta o mimetype pelo Buffer.
 */
export async function sendMedia(
  ctx: IBotContext,
  jid: string,
  media: Buffer | string,
  msg?: proto.IWebMessageInfo,
  options: {
    caption?: string;
    ptt?: boolean; // true = manda áudio como voz
    asSticker?: boolean; // converte imagem em figurinha
    fileName?: string; // nome caso seja documento
  } = {},
) {
  try {
    const buffer = await getBuffer(media);
    const type = await fileTypeFromBuffer(buffer);

    let message: any = {};

    if (options.asSticker) {
      // Força envio como figurinha
      message = { sticker: buffer };
    } else if (type) {
      if (type.mime.startsWith("image")) {
        message = { image: buffer, caption: options.caption };
      } else if (type.mime.startsWith("video")) {
        message = { video: buffer, caption: options.caption };
      } else if (type.mime.startsWith("audio")) {
        message = { audio: buffer, ptt: options.ptt ?? false };
      } else {
        // documento genérico
        message = {
          document: buffer,
          mimetype: type.mime,
          fileName: options.fileName || `file.${type.ext}`,
        };
      }
    } else {
      // fallback caso não detecte o tipo
      message = { document: buffer, fileName: options.fileName || "file" };
    }

    await ctx.socket.sendMessage(jid, message, { quoted: msg });
  } catch (e) {
    console.error("Erro ao enviar mídia:", e);
  }
}

/** Pega Uma Coisa Aleatória De Um Array Lista De Objeto */
export function getRandom(list: string[]) {
  return list[Math.floor(list.length * Math.random())];
}

/** Envia Uma Mensagem Rápida Marcando O Usuário */
export async function sendMsg(
  ctx: IBotContext,
  jid: string,
  text: string,
  msg: proto.IWebMessageInfo,
) {
  await ctx.socket.sendMessage(jid, { text }, { quoted: msg });
}

/** Envia Uma Mensagem De Anúncio Marcando O Usuário */
export async function sendReply(
  ctx: IBotContext,
  text: string,
  msg: proto.IWebMessageInfo,
) {
  const jid = msg.key.remoteJid!;
  await ctx.socket.sendMessage(
    jid,
    {
      text,
      contextInfo: {
        isForwarded: true,
        /*  forwardingScore: 245, */
        externalAdReply: {
          mediaUrl: "https://github.com/HenriqueX-Flow",
          mediaType: 2,
          //@ts-ignore
          previewType: "pdf",
          title: "Invoke RiqueX",
          body: "© HenriqueX",
          thumbnailUrl: "https://files.catbox.moe/d5d2x5.jpg",
          sourceUrl: "https://github.com/HenriqueX-Flow",
        },
      },
    },
    { quoted: msg },
  );
}

/** Verifica Se A Mensagem É Uma Imagem */
export function isImage(msg: WAMessage): boolean {
  return (
    !!msg.message?.imageMessage ||
    !!msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage
  );
}

/** Verifica Se A Mensagem É Um Vídeo */
export function isVideo(msg: WAMessage): boolean {
  return (
    !!msg.message?.videoMessage ||
    !!msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage
  );
}

export function isAudio(msg: WAMessage): boolean {
  return (
    !!msg.message?.audioMessage ||
    !!msg.message?.audioMessage?.ptt ||
    !!msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.audioMessage
  );
}

/** Verifica Se A Mensagem É Em Um Grupo */
export function isGroup(msg: WAMessage): boolean {
  return msg.key.remoteJid?.endsWith("@g.us") ?? false;
}

/** Verifica Se A Mensagem Foi Enviada Por Um Admin */
export async function isAdmin(
  ctx: IBotContext,
  msg: WAMessage,
): Promise<boolean> {
  const jid = msg.key.remoteJid!;
  if (!isGroup(msg)) return false;

  const sender = msg.key.participant!;
  const metadata = await ctx.socket.groupMetadata(jid);
  const admins = metadata.participants
    .filter((p) => p.admin !== null)
    .map((p) => p.id);

  return admins.includes(sender);
}

/** Verifica Se O Bot É Admin Do Grupo */
export async function isBotAdmin(
  ctx: IBotContext,
  msg: WAMessage,
): Promise<boolean> {
  const jid = msg.key.remoteJid!;
  if (!isGroup(msg)) return false;

  const botId = ctx.socket.user?.id?.split(":")[0] + "@s.whatsapp.net";
  const metadata = await ctx.socket.groupMetadata(jid);
  const admins = metadata.participants
    .filter((p) => p.admin !== null)
    .map((p) => p.id);

  return admins.includes(botId);
}

/** Pega O Remetente Da Mensagem  */
export function getSender(msg: any) {
  return msg.key.participant || msg.key.remoteJid;
}

/** Verifica Se A Mensagem Foi Enviada Pelo O Criador/Bot */
export function isOwner(msg: WAMessage): boolean {
  const sender = getSender(msg);
  return config.ownerNumber.includes(sender);
}

/**
 * Faz Download Da Mídia Da Mensagem Ou Da Mensagem Citada
 */
export async function downloadMedia(msg: WAMessage): Promise<Buffer | null> {
  try {
    let targetMsg = msg;

    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (quoted?.imageMessage || quoted?.videoMessage || quoted?.audioMessage) {
      // Cria uma "nova mensagem" usando a key do quotedMessage
      targetMsg = {
        key: msg.message?.extendedTextMessage?.contextInfo?.stanzaId
          ? {
              ...msg.key,
              id: msg.message.extendedTextMessage.contextInfo.stanzaId,
            }
          : msg.key,
        message: quoted,
      } as WAMessage;
    }

    const buffer = await downloadMediaMessage(targetMsg, "buffer", {});
    return buffer as Buffer;
  } catch (e) {
    console.error("Erro Ine Ao Baixar Mídia:", e);
    return null;
  }
}

