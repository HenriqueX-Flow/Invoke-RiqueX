import * as JimpModule from "jimp";

console.log("JimpModule keys:", Object.keys(JimpModule));
console.log("JimpModule.default keys:", JimpModule && (JimpModule as any).default ? Object.keys((JimpModule as any).default) : "sem default");