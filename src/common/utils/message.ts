import { downloadMediaMessage, proto, WAMessage } from "baileys";
import { IBotContext } from "../interface";
import { config } from "../../config";

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
    !!msg.message?.imageMessage ||
    !!msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage
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
  let targetMsg: WAMessage = msg;

  // Se A Mensagem For Citação E Tiver Mídia, Usa Ela
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  if (quoted?.imageMessage || quoted?.videoMessage) {
    targetMsg = { key: msg.key, message: quoted } as WAMessage;
  }

  try {
    const buffer = await downloadMediaMessage(targetMsg, "buffer", {});
    return buffer as Buffer;
  } catch (e) {
    console.error("Erro Ine Ao Baixar Mídia:", e);
    return null;
  }
}

