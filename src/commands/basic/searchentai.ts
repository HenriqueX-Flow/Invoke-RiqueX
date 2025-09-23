import { ICommand } from "../../common/interface";
import * as cheerio from "cheerio";
import axios from "axios";
import { sendReply } from "../../common/utils/message";

interface HentaiItem {
  title: string;
  link: any;
  video_1: string;
}

async function hentai(): Promise<HentaiItem[]> {
  const page = Math.floor(Math.random() * 1153);
  try {
    const { data } = await axios.get("https://sfmcompile.club/page/" + page);
    const $ = cheerio.load(data);
    const result: HentaiItem[] = [];

    $("#primary > div > div > ul > li > article").each((_, b) => {
      result.push({
        title: $(b).find("header > h2").text().trim(),
        link: $(b).find("header > h2 > a").attr("href"),
        video_1: $(b).find("source").attr("src") || ""
      });
    });

    return result;
  } catch (err) {
    console.error("Erro Ao Buscar Hentai:", err);
    return [];
  }
}

const ssrh: ICommand = {
  name: "hentai",
  help: "",
  category: "basicos",
  async execute(ctx, msg) {
    const jid = msg.key.remoteJid!;

    let results = await hentai();
    if (results.length === 0) {
      await sendReply(ctx, "Nenhum Resultado Encotrado.", msg);
      return;

    }

    let item = results[Math.floor(Math.random() * results.length)];

    await ctx.socket.sendMessage(jid, {
      video: { url: item.video_1 },
      caption: `Título: ${item.title}\nLink: ${item.link}`,
      viewOnce: true,
    }, { quoted: msg });
  }
};

export default ssrh;
