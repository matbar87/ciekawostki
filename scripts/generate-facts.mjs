#!/usr/bin/env node
/**
 * Generator/scalacz bazy ciekawostek.
 *
 * Wczytuje wszystkie partie (pliki *.json) z `scripts/facts-source/`,
 * waliduje kompletność i poprawność pól, dedukuje duplikaty (po id oraz po
 * znormalizowanej treści), automatycznie dolicza `readingTimeSeconds`
 * i zapisuje wynik jako pojedynczy plik `src/data/facts/generated.facts.json`.
 *
 * Dzięki architekturze `import.meta.glob('./*.facts.json')` w
 * `src/data/facts/index.ts`, wynikowy plik zostaje automatycznie podłączony
 * do aplikacji – bez jakiejkolwiek zmiany kodu.
 *
 * Aby rozbudować bazę do tysięcy rekordów: dodaj kolejne pliki (lub więcej
 * rekordów w istniejących) w `scripts/facts-source/` i uruchom ponownie:
 *   npm run facts:build
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = path.join(__dirname, 'facts-source');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data', 'facts');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'generated.facts.json');

const REQUIRED_FIELDS = [
  'id',
  'title',
  'content',
  'category',
  'explanation',
  'surpriseLevel',
  'source',
  'sourceUrl',
];

const VALID_CATEGORIES = new Set([
  'science', 'space', 'history', 'psychology', 'biology', 'medicine',
  'physics', 'chemistry', 'mathematics', 'geography', 'technology',
  'computerScience', 'ai', 'archaeology', 'language', 'culture', 'art',
  'music', 'sport', 'animals', 'plants', 'society', 'economy',
  'inventions', 'earth', 'human',
]);

const CONTENT_MIN_LENGTH = 90;
const CONTENT_MAX_LENGTH = 230;
const READING_CHARS_PER_SECOND = 15; // ~ 200 słów/min dla krótkich tekstów PL

function normalizeForComparison(text) {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function computeReadingTime(fact) {
  const totalChars = fact.content.length + fact.explanation.length;
  return Math.max(10, Math.round(totalChars / READING_CHARS_PER_SECOND));
}

function validate(fact, fileName, errors) {
  for (const field of REQUIRED_FIELDS) {
    if (fact[field] === undefined || fact[field] === null || fact[field] === '') {
      errors.push(`[${fileName}] id="${fact.id ?? '?'}" - brak pola "${field}"`);
      return false;
    }
  }
  if (!VALID_CATEGORIES.has(fact.category)) {
    errors.push(`[${fileName}] id="${fact.id}" - nieznana kategoria "${fact.category}"`);
    return false;
  }
  if (typeof fact.surpriseLevel !== 'number' || fact.surpriseLevel < 1 || fact.surpriseLevel > 5) {
    errors.push(`[${fileName}] id="${fact.id}" - surpriseLevel poza zakresem 1-5`);
    return false;
  }
  if (fact.content.length < CONTENT_MIN_LENGTH || fact.content.length > CONTENT_MAX_LENGTH) {
    errors.push(
      `[${fileName}] id="${fact.id}" - długość treści ${fact.content.length} znaków (oczekiwano ${CONTENT_MIN_LENGTH}-${CONTENT_MAX_LENGTH})`,
    );
    return false;
  }
  return true;
}

async function main() {
  const files = (await readdir(SOURCE_DIR)).filter((f) => f.endsWith('.json'));
  if (files.length === 0) {
    console.error(`Brak plików źródłowych w ${SOURCE_DIR}`);
    process.exit(1);
  }

  const errors = [];
  const seenIds = new Set();
  const seenContent = new Map(); // normalizedContent -> id (do raportu duplikatów)
  const result = [];

  let totalRead = 0;

  for (const file of files) {
    const raw = await readFile(path.join(SOURCE_DIR, file), 'utf-8');
    let batch;
    try {
      batch = JSON.parse(raw);
    } catch (e) {
      errors.push(`[${file}] nieprawidłowy JSON: ${e.message}`);
      continue;
    }

    for (const fact of batch) {
      totalRead++;
      if (!validate(fact, file, errors)) continue;

      if (seenIds.has(fact.id)) {
        errors.push(`[${file}] duplikat id="${fact.id}"`);
        continue;
      }

      const normalized = normalizeForComparison(fact.content);
      if (seenContent.has(normalized)) {
        errors.push(
          `[${file}] duplikat treści dla id="${fact.id}" (podobne do "${seenContent.get(normalized)}")`,
        );
        continue;
      }

      seenIds.add(fact.id);
      seenContent.set(normalized, fact.id);
      result.push({ ...fact, readingTimeSeconds: computeReadingTime(fact) });
    }
  }

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(result, null, 2) + '\n', 'utf-8');

  console.log(`Wczytano rekordów:      ${totalRead}`);
  console.log(`Zapisano do bazy:       ${result.length}`);
  console.log(`Odrzucono (błędy/duplikaty): ${totalRead - result.length}`);

  const perCategory = {};
  for (const fact of result) {
    perCategory[fact.category] = (perCategory[fact.category] ?? 0) + 1;
  }
  console.log('\nRozkład kategorii:');
  for (const [cat, count] of Object.entries(perCategory).sort()) {
    console.log(`  ${cat.padEnd(16)} ${count}`);
  }

  if (errors.length > 0) {
    console.log(`\nOstrzeżenia/błędy (${errors.length}):`);
    errors.forEach((e) => console.log(`  - ${e}`));
  }

  console.log(`\nBaza zapisana w: ${path.relative(process.cwd(), OUTPUT_FILE)}`);
}

main();
