import moment from "moment-timezone";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { ICommand, IBotContext } from "../../common/interface";

const stalker: ICommand = {
  name: "stalker",
  help: "(opção)",
  category: "geral",
  usage: ":stalker <numero>",
  async execute(ctx: IBotContext, msg, args) {
    const jid = msg.key.remoteJid!;
    
    let num =
      msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
      msg.message?.extendedTextMessage?.contextInfo?.participant ||
      args[0];

    if (!num) throw "Você Precisa Mencionar, Responder Ou Digitar Um Número.";

    num = num.replace(/\D/g, "") + "@s.whatsapp.net";

    const result = await ctx.socket.onWhatsApp(num).catch(() => []);
    const contact = result?.[0];
    const exists = contact?.exists ?? false;
    if (!exists) throw "Usuário Não Existe No WhatsApp.";

    const img = await ctx.socket.profilePictureUrl(num, "image").catch(() => null);
    const bioArray = await ctx.socket.fetchStatus(num).catch(() => []);
    const bio = bioArray?.[0];

    const business = await ctx.socket.getBusinessProfile(num).catch(() => null);

    const rawNum = num.split("@")[0];
    const phone = parsePhoneNumberFromString("+" + rawNum);

    const country = phone?.country || "-";
    const formatted = phone?.formatInternational() || "+" + rawNum;

    let waMessage = `*WhatsApp*
Nome: @${rawNum}
País: ${country}
Formato Número: ${formatted}
Url: wa.me/${rawNum}
Status: ${bio?.status || "-"}

${business ? `*WhatsApp Business*
BusinessId: ${business.wid}
WebSite: ${business.website || "-"}
Categoria: ${business.category || "-"}
Fuso Horário: ${business.business_hours?.timezone || "-"}
Descrição: ${business.description || "-"}` : ""}`;

    if (img) {
      await ctx.socket.sendMessage(jid, {
          image: { url: img },
          caption: waMessage,
          mentions: [num],
        }, { quoted: msg });
    } else {
      await ctx.socket.sendMessage(jid, {
          text: waMessage,
          mentions: [num],
        }, { quoted: msg });
    }
  },
};

export default stalker;
