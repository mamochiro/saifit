import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../apps/web/public/icons");

// SVG dumbbell icon on gradient background
function makeSvg(size) {
  const pad = Math.round(size * 0.18);
  const iconSize = size - pad * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a1240"/>
      <stop offset="100%" stop-color="#0d0b1e"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="url(#bg)"/>
  <g transform="translate(${pad}, ${pad})">
    <svg viewBox="0 0 24 24" width="${iconSize}" height="${iconSize}" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3M6 8h12M6 16h12"/>
    </svg>
  </g>
</svg>`;
}

const sizes = [192, 256, 384, 512];

for (const size of sizes) {
  const svg = Buffer.from(makeSvg(size));
  await sharp(svg).png().toFile(join(OUT, `icon-${size}.png`));
  console.log(`Generated icon-${size}.png`);
}

console.log("Done!");
