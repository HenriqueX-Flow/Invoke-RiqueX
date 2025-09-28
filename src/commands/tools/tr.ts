import { ICommand } from "../../common/interface";
import { sendReply } from "../../common/utils/message";

const defaultLang = "pt";

const langMap: Record<string, string> = {
  portuguese: "pt",
  portugues: "pt",
  português: "pt",

  english: "en",
  inglês: "en",

  spanish: "es",
  español: "es",
  espanhol: "es",

  french: "fr",
  francês: "fr",

  german: "de",
  alemão: "de",

  italian: "it",
  italiano: "it",

  japanese: "ja",
  japonês: "ja",

  chinese: "zh-cn",
  chinês: "zh-cn",

  russian: "ru",
  russo: "ru",
};

function resolveLangCandidate(candidate: string | undefined): string | null {
  if (!candidate) return null;
  const clean = candidate.toLowerCase().trim();
  const m =
    clean.match(/^([a-z]{2}(?:-[a-z]{2})?)/i) ||
    clean.match(/([a-z]{2})/i);
  const code = m ? m[1].toLowerCase() : null;
  if (!code) {
    return langMap[clean] ?? null;
  }
  if (/^[a-z]{2}(?:-[a-z]{2})?$/.test(code)) return code;
  return langMap[code] ?? null;
}

const cmdTranslate: ICommand = {
  name: "tr",
  help: "(texto idioma)",
  category: "ferramentas",
  async execute(ctx, msg, args) {
    if (!args || args.length === 0) {
      await sendReply(
        ctx,
        "Coloque o texto após o comando.\nEx: :tr Hello World pt", msg);
      return;
    }

    const lastArg = args[args.length - 1];
    const possibleLang = resolveLangCandidate(lastArg);
    let text = args.join(" ");
    let target = defaultLang;

    if (possibleLang) {
      target = possibleLang;
      text = args.slice(0, -1).join(" ");
      if (!text || !text.trim()) {
        await sendReply(
          ctx,
          "⚠️ Texto vazio. Coloque o texto antes do código de idioma.", msg);
        return;
      }
    }

    try {
      const mod = await import("@vitalets/google-translate-api");
      const translate: any = (mod?.default ?? mod?.translate ?? mod) as any;

      const result: any = await translate(text, { to: target });

      const fromLang = result?.from?.language?.iso ?? "auto";
      const output = result?.text ?? String(result);

      await sendReply(
        ctx,
        `🌍 Tradução (${fromLang} ➝ ${target}):\n${output}`, msg);
    } catch (err: any) {
      console.error("Erro ao chamar translate():", err);
      await sendReply(ctx, "❌ Erro ao traduzir.", msg);
    }
  },
};

export default cmdTranslate;