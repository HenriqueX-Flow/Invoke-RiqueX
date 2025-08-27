import { exec } from "child_process";
import fs from "fs";
import path from "path";

/**
 * Gera um caminho único para arquivos temporários
 */
function tempFile(ext: string) {
  return path.join(__dirname, `temp_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`);
}

/**
 * Converte Uma Imagem (png/jpg) Para webp (figurinha)
 */
export async function imageToWeb(input: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const inputPath = tempFile("png");
    const outputPath = tempFile("webp");

    fs.writeFileSync(inputPath, input);

    exec(
      `ffmpeg -y -i "${inputPath}" -vf scale=512:512:force_original_aspect_ratio=decrease "${outputPath}"`,
      (err) => {
        try {
          if (err) return reject(err);

          const webp = fs.readFileSync(outputPath);

          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);

          resolve(webp);
        } catch (e) {
          reject(e);
        }
      },
    );
  });
}

/**
 * Converte WebP para PNG
 */
export async function webpToPng(input: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const inputPath = tempFile("webp");
    const outputPath = tempFile("png");

    fs.writeFileSync(inputPath, input);

    exec(`ffmpeg -y -i "${inputPath}" "${outputPath}"`, (err) => {
      try {
        if (err) return reject(err);

        const png = fs.readFileSync(outputPath);

        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);

        resolve(png);
      } catch (e) {
        reject(e);
      }
    });
  });
}

/**
 * Converte vídeo (mp4) para figurinha animada (webp)
 * - Máx 10 segundos
 * - 512x512 com aspect ratio
 * - FPS reduzido (15) para caber no WhatsApp
 */
export async function videoToWeb(input: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const inputPath = tempFile("mp4");
    const outputPath = tempFile("webp");

    fs.writeFileSync(inputPath, input);

    exec(
      `ffmpeg -y -i "${inputPath}" -t 10 -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15" -loop 0 "${outputPath}"`,
      (err) => {
        try {
          if (err) return reject(err);

          const webp = fs.readFileSync(outputPath);

          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);

          resolve(webp);
        } catch (e) {
          reject(e);
        }
      },
    );
  });
}