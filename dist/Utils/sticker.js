"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageToWeb = imageToWeb;
exports.webpToPng = webpToPng;
exports.videoToWeb = videoToWeb;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Gera um caminho único para arquivos temporários
 */
function tempFile(ext) {
    return path_1.default.join(__dirname, `temp_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`);
}
/**
 * Converte Uma Imagem (png/jpg) Para webp (figurinha)
 */
async function imageToWeb(input) {
    return new Promise((resolve, reject) => {
        const inputPath = tempFile("png");
        const outputPath = tempFile("webp");
        fs_1.default.writeFileSync(inputPath, input);
        (0, child_process_1.exec)(`ffmpeg -y -i "${inputPath}" -vf scale=512:512:force_original_aspect_ratio=decrease "${outputPath}"`, (err) => {
            try {
                if (err)
                    return reject(err);
                const webp = fs_1.default.readFileSync(outputPath);
                fs_1.default.unlinkSync(inputPath);
                fs_1.default.unlinkSync(outputPath);
                resolve(webp);
            }
            catch (e) {
                reject(e);
            }
        });
    });
}
/**
 * Converte WebP para PNG
 */
async function webpToPng(input) {
    return new Promise((resolve, reject) => {
        const inputPath = tempFile("webp");
        const outputPath = tempFile("png");
        fs_1.default.writeFileSync(inputPath, input);
        (0, child_process_1.exec)(`ffmpeg -y -i "${inputPath}" "${outputPath}"`, (err) => {
            try {
                if (err)
                    return reject(err);
                const png = fs_1.default.readFileSync(outputPath);
                fs_1.default.unlinkSync(inputPath);
                fs_1.default.unlinkSync(outputPath);
                resolve(png);
            }
            catch (e) {
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
async function videoToWeb(input) {
    return new Promise((resolve, reject) => {
        const inputPath = tempFile("mp4");
        const outputPath = tempFile("webp");
        fs_1.default.writeFileSync(inputPath, input);
        (0, child_process_1.exec)(`ffmpeg -y -i "${inputPath}" -t 10 -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15" -loop 0 "${outputPath}"`, (err) => {
            try {
                if (err)
                    return reject(err);
                const webp = fs_1.default.readFileSync(outputPath);
                fs_1.default.unlinkSync(inputPath);
                fs_1.default.unlinkSync(outputPath);
                resolve(webp);
            }
            catch (e) {
                reject(e);
            }
        });
    });
}
