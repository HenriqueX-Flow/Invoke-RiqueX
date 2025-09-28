import gTTS from "node-gtts";
import { ICommand } from "../../common/interface";
import { readFileSync, unlinkSync } from "fs";
import { join } from "path";

const defaultLang = "pt";

const ttsCmd: ICommand = {
  name: "tts",
  help: "(texto idioma)",
  category: "ferramentas",
  usage: ":tts Hello world en",
  async execute(ctx, msg, args) {
    let lang = args[0];
    let text = args.slice(1).join(" ");

    if ((args[0] || "").length !== 2) {
      lang = defaultLang;
      text = args.join(" ");
    }

    let res: Buffer | undefined;
    try {
      res = await tts(text, lang);
    } catch (e) {
      console.log(e);
      text = args.join(" ");
      if (!text) throw "Exemplo :tts Hello world en";
      res = await tts(text, defaultLang);
    }

    if (res) {
      await ctx.socket.sendMessage(
        msg.key.remoteJid!,
        {
          audio: res,
          mimetype: "audio/mpeg",
          ptt: false,
        },
        { quoted: msg }
      );
    }
  },
};

function tts(text: string, lang = "pt"): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const gtts = gTTS(lang);
      const filePath = join(__dirname, "..", "..", "common", "tmp", `${Date.now()}.wav`);

      gtts.save(filePath, text, () => {
        try {
          const buffer = readFileSync(filePath);
          unlinkSync(filePath);
          resolve(buffer);
        } catch (err) {
          reject(err);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

export default ttsCmd;