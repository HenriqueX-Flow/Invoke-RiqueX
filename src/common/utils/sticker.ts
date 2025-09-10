import * as fs from "fs";
import * as path from "path";
import { fileTypeFromBuffer } from "file-type";
import fetch from "node-fetch";
import fluent_ffmpeg from "fluent-ffmpeg";
import * as crypto from "crypto";

const webp = require("node-webpmux");

// Aqui pode usar o __dirname nativo do Node (CommonJS)
const tmpDir = path.join(__dirname, "../tmp");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

function tempFile(ext: string) {
  return path.join(tmpDir, `temp_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`);
}

async function addExif(webpSticker: Buffer, packname: string, author: string): Promise<Buffer> {
  const img = new webp.Image();
  const stickerPackId = crypto.randomBytes(32).toString("hex");
  const json = {
    "sticker-pack-id": stickerPackId,
    "sticker-pack-name": packname,
    "sticker-pack-publisher": author,
    emojis: [""],
  };

  const exifAttr = Buffer.from([
    0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
  ]);

  const jsonBuffer = Buffer.from(JSON.stringify(json), "utf8");
  const exif = Buffer.concat([exifAttr, jsonBuffer]);
  exif.writeUIntLE(jsonBuffer.length, 14, 4);

  await img.load(webpSticker);
  img.exif = exif;
  return img.save(null);
}

export async function sticker(
  input: Buffer,
  url?: string,
  packname = "Bot",
  author = "Sticker"
): Promise<Buffer> {
  try {
    if (url) {
      const res = await fetch(url);
      if (res.status !== 200) throw new Error(await res.text());
      input = Buffer.from(await res.arrayBuffer());
    }

    const type = await fileTypeFromBuffer(input);
    if (!type) throw new Error("Tipo de arquivo não suportado");

    const isAnimation = ["mp4", "webm", "gif"].includes(type.ext);
    const tmpIn = tempFile(type.ext);
    const tmpOut = tempFile("webp");

    await fs.promises.writeFile(tmpIn, input);

    await new Promise<void>((resolve, reject) => {
      let ff = fluent_ffmpeg(tmpIn)
        .on("error", (err) => reject(err))
        .on("end", () => resolve());

      if (isAnimation) {
        ff.addOutputOptions([
          "-vcodec", "libwebp",
          "-vf", "scale=512:512:force_original_aspect_ratio=decrease,fps=15",
          "-loop", "0",
          "-vsync", "vfr",
          "-t", "10",
          "-qscale", "50",
        ]);
      } else {
        ff.addOutputOptions([
          "-vcodec", "libwebp",
          "-vf", "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:-1:-1:color=white@0.0",
        ]);
      }

      ff.toFormat("webp").save(tmpOut);
    });

    const webpBuffer = await fs.promises.readFile(tmpOut);

    fs.promises.unlink(tmpIn).catch(() => {});
    fs.promises.unlink(tmpOut).catch(() => {});

    return await addExif(webpBuffer, packname, author);
  } catch (err) {
    console.error("Erro ao criar sticker:", err);
    throw err;
  }
}