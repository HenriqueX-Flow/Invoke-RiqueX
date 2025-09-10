import { promises as fs } from "fs";
import { join } from "path";
import { spawn } from "child_process";

interface FfmpegResult {
  data: Buffer;
  filename: string;
  delete: () => Promise<void>;
}

function ffmpeg(
  buffer: Buffer,
  args: string[] = [],
  ext: string = "",
  ext2: string = ""
): Promise<FfmpegResult> {
  return new Promise(async (resolve, reject) => {
    try {
      const tmp = join(__dirname, "../tmp", `${Date.now()}.${ext}`);
      const out = `${tmp}.${ext2}`;
      await fs.writeFile(tmp, buffer);

      spawn("ffmpeg", ["-y", "-i", tmp, ...args, out])
        .on("error", reject)
        .on("close", async (code) => {
          try {
            await fs.unlink(tmp);
            if (code !== 0) return reject(new Error(`ffmpeg exited ${code}`));

            resolve({
              data: await fs.readFile(out),
              filename: out,
              delete() {
                return fs.unlink(out);
              },
            });
          } catch (e) {
            reject(e);
          }
        });
    } catch (e) {
      reject(e);
    }
  });
}

function toPTT(buffer: Buffer, ext: string) {
  return ffmpeg(buffer, ["-vn", "-c:a", "libopus", "-b:a", "128k", "-vbr", "on"], ext, "ogg");
}

function toAudio(buffer: Buffer, ext: string) {
  return ffmpeg(
    buffer,
    ["-vn", "-c:a", "libopus", "-b:a", "128k", "-vbr", "on", "-compression_level", "10"],
    ext,
    "opus"
  );
}

function toVideo(buffer: Buffer, ext: string) {
  return ffmpeg(
    buffer,
    ["-c:v", "libx264", "-c:a", "aac", "-ab", "128k", "-ar", "44100", "-crf", "32", "-preset", "slow"],
    ext,
    "mp4"
  );
}

export { toAudio, toPTT, toVideo, ffmpeg };