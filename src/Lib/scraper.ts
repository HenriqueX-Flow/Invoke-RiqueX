// src/Lib/scraper.ts
import axios from "axios";
import { load, CheerioAPI } from "cheerio";

export interface StyleResult {
  name: string;
  result: string;
}

export class Scraper {
  static async style(query: string): Promise<StyleResult[]> {
    try {
      const { data: html } = await axios.get(
        "http://qaz.wtf/u/convert.cgi?text=" + encodeURIComponent(query)
      );

      const $: CheerioAPI = load(html);
      const result: StyleResult[] = [];

      $("table > tbody > tr").each((_, el) => {
        result.push({
          name: $(el).find("td:nth-child(1) > span").text(),
          result: $(el).find("td:nth-child(2)").text().trim(),
        });
      });

      return result;
    } catch (err) {
      console.error("Erro no Scraper.style:", err);
      throw err;
    }
  }
}