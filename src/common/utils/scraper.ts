import axios, { AxiosResponse } from "axios";
import { CheerioAPI, load } from "cheerio";

export interface IStyleResult {
  name: string;
  result: string;
}

export interface ITxt2ImgResponse {
  result?: string[];
}

export interface ITxt2ImgResult {
  success: boolean;
  images?: string[];
  errors?: unknown;
}

export class Scraper {
  /** Scraper De Gerar Nicks */
  static async style(query: string): Promise<IStyleResult[]> {
    try {
      const { data: html } = await axios.get(
        "http://qaz.wtf/u/convert.cgi?text=" + encodeURIComponent(query),
      );

      const $: CheerioAPI = load(html);
      const result: IStyleResult[] = [];
      $("table > tbody > tr").each((_, el) => {
        result.push({
          name: $(el).find("td:nth-child(1) > span").text(),
          result: $(el).find("td:nth-child(2)").text().trim(),
        });
      });

      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  static async txt2image(prompt: string): Promise<ITxt2ImgResult> {
    if (!prompt) {
      return {
        success: false,
        errors: "Entrada De Prompt Ausente",
      };
    }

    try {
      const response: AxiosResponse<ITxt2ImgResponse> = await axios.post(
        "https://internal.users.n8n.cloud/webhook/ai_image_generator",
        { prompt },
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Zanixon/1.0.0",
            "X-Client-Ip": Scraper.generateIp(),
          },
        },
      );

      const data = response.data;

      if (!data.result) {
        return {
          success: false,
          errors: "Falha Inesperada Ao Gerar Imagem",
        };
      }

      return {
        success: true,
        images: data.result,
      };
    } catch (e) {
      console.error(e);
      return {
        success: false,
        errors: e,
      };
    }
  }

  private static generateIp(): string {
    const x = (a: number) => Math.floor(Math.random() * a);
    return `${x(300)}.${x(300)}.${x(300)}.${x(300)}`;
  }
}
