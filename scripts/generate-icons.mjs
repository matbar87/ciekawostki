#!/usr/bin/env node
/**
 * Generuje ikony PWA (192/512, w tym warianty maskowalne z marginesem
 * bezpieczeństwa) z jednego wektorowego źródła, żeby nie trzymać w
 * repozytorium ręcznie eksportowanych rastrów.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'icons');

const PRIMARY = '#6750a4';
const ON_PRIMARY = '#fffbfe';

function baseIcon({ size, contentScale }) {
  const glyphSize = size * contentScale;
  const offset = (size - glyphSize) / 2;
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" fill="${PRIMARY}"/>
      <g transform="translate(${offset}, ${offset})">
        <circle cx="${glyphSize / 2}" cy="${glyphSize * 0.42}" r="${glyphSize * 0.26}" fill="${ON_PRIMARY}"/>
        <rect x="${glyphSize * 0.4}" y="${glyphSize * 0.62}" width="${glyphSize * 0.2}" height="${glyphSize * 0.16}" rx="${glyphSize * 0.04}" fill="${ON_PRIMARY}"/>
        <rect x="${glyphSize * 0.44}" y="${glyphSize * 0.8}" width="${glyphSize * 0.12}" height="${glyphSize * 0.06}" rx="${glyphSize * 0.03}" fill="${ON_PRIMARY}"/>
      </g>
    </svg>
  `;
}

async function generate(name, { size, contentScale }) {
  const svg = baseIcon({ size, contentScale });
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
  await writeFile(path.join(OUTPUT_DIR, name), buffer);
  console.log(`Zapisano ${name} (${size}x${size})`);
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  // Ikony "any": grafika może wypełniać cały obszar.
  await generate('icon-192.png', { size: 192, contentScale: 0.68 });
  await generate('icon-512.png', { size: 512, contentScale: 0.68 });
  // Ikony "maskable": wymagają marginesu bezpieczeństwa (safe zone ~80%),
  // bo system może przyciąć obraz do koła lub zaokrąglonego kwadratu.
  await generate('icon-maskable-192.png', { size: 192, contentScale: 0.5 });
  await generate('icon-maskable-512.png', { size: 512, contentScale: 0.5 });
}

main();
