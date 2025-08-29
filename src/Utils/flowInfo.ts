import {
  proto,
  generateWAMessageFromContent,
  generateWAMessageContent,
  WASocket
} from "baileys";

interface ListButton {
  name: string
  buttonParamsJson: Record<string, any> | string
}

interface SendListOptions {
  text?: string
  caption?: string
  footer?: string
  title?: string
  subtitle?: string
  ai?: boolean
  contextInfo?: proto.IContextInfo
  buttons: ListButton[]
  mentions?: string[]
  quoted?: proto.IMessage
  media?: Record<string, any>
}

export async function sendListMsg(
  sock: WASocket,
  jid: string,
  content: SendListOptions
) {
  const {
    text,
    caption,
    footer = "",
    title,
    subtitle,
    ai,
    contextInfo = {},
    buttons,
    mentions = [],
    quoted,
    media = {}
  } = content

  const msg = await generateWAMessageFromContent(jid, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: text || caption || "",
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({ text: footer }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            title,
            subtitle,
            hasMediaAttachment: Object.keys(media).length > 0,
            ...(Object.keys(media).length > 0
              ? await generateWAMessageContent(media, { upload: sock.waUploadToServer })
              : {}),
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: buttons.map((btn) => ({
              name: btn.name,
              buttonParamsJson: JSON.stringify(
                typeof btn.buttonParamsJson === "string"
                  ? JSON.parse(btn.buttonParamsJson)
                  : btn.buttonParamsJson
              ),
            })),
          }),
          contextInfo: {
            ...contextInfo,
            mentionedJid: mentions,
            ...(quoted
              ? {
                  stanzaId: quoted.key?.id,
                  remoteJid: quoted.key?.remoteJid,
                  participant: quoted.key?.participant || quoted.key?.remoteJid,
                  fromMe: quoted.key?.fromMe,
                  quotedMessage: quoted.message,
                }
              : {}),
          },
        }),
      },
    },
  }, {})

  return await sock.relayMessage(msg.key.remoteJid!, msg.message!, {
    messageId: msg.key.id!,
    additionalNodes: [
      {
        tag: "biz",
        attrs: {},
        content: [
          {
            tag: "interactive",
            attrs: { type: "native_flow", v: "1" },
            content: [{ tag: "native_flow", attrs: { name: "quick_reply" } }],
          },
        ],
      },
      ...(ai ? [{ attrs: { biz_bot: "1" }, tag: "bot" }] : []),
    ],
  })
}
