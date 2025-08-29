import axios, { AxiosResponse } from "axios";
import { load, CheerioAPI } from "cheerio";

export interface StyleResult {
  name: string;
  result: string;
}

export interface Txt2ImgResponse {
  result?: string[];
}

export interface Txt2ImgResult {
  success: boolean;
  images?: string[];
  errors?: unknown;
}

export class Scraper {
  /**
   * Scraper de estilos de texto
   */
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

  /**
   * Gera imagens a partir de um prompt usando IA
   */
  static async txt2img(prompt: string): Promise<Txt2ImgResult> {
    if (!prompt) {
      return {
        success: false,
        errors: "Missing prompt input",
      };
    }

    try {
      const response: AxiosResponse<Txt2ImgResponse> = await axios.post(
        "https://internal.users.n8n.cloud/webhook/ai_image_generator",
        { prompt },
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Zanixon/1.0.0",
            "X-Client-Ip": Scraper.generateIp(),
          },
        }
      );

      const data = response.data;

      if (!data.result) {
        return {
          success: false,
          errors: "Failed generating image",
        };
      }

      return {
        success: true,
        images: data.result,
      };
    } catch (error) {
      console.error("Erro no Scraper.txt2img:", error);
      return {
        success: false,
        errors: error,
      };
    }
  }

  /**
   * Gera um IP aleatório (para headers da API)
   */
  private static generateIp(): string {
    const x = (a: number) => Math.floor(Math.random() * a);
    return `${x(300)}.${x(300)}.${x(300)}.${x(300)}`;
  }
}
