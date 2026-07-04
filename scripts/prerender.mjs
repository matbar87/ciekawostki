#!/usr/bin/env node
/**
 * Krok po `vite build`: generuje prawdziwe, statyczne pliki HTML dla każdej
 * ciekawostki (`/ciekawostka/<id>/index.html`) oraz dla kilku kluczowych
 * tras aplikacji, z poprawnymi meta tagami (title, description, canonical,
 * Open Graph, Twitter Card, JSON-LD) i czytelną treścią wewnątrz #root
 * (widoczną dla robotów jeszcze zanim wykona się JavaScript). Dzięki temu
 * każda ciekawostka ma własny, indeksowalny adres URL — bez potrzeby
 * własnego serwera czy SSR w czasie działania.
 *
 * Uruchamiane automatycznie jako część `npm run build`.
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const FACTS_FILE = path.join(ROOT, 'src', 'data', 'facts', 'generated.facts.json');

// Musi być zgodny z fallbackiem w README / zmienną środowiskową Vercela.
const SITE_URL = (process.env.SITE_URL || 'https://ciekawy.vercel.app').replace(/\/$/, '');

// Etykiety kategorii do statycznej treści — muszą być zgodne z src/data/categories.ts.
const CATEGORY_LABELS = {
  science: 'Nauka',
  space: 'Kosmos',
  history: 'Historia',
  psychology: 'Psychologia',
  biology: 'Biologia',
  medicine: 'Medycyna',
  physics: 'Fizyka',
  chemistry: 'Chemia',
  mathematics: 'Matematyka',
  geography: 'Geografia',
  technology: 'Technologia',
  computerScience: 'Informatyka',
  ai: 'Sztuczna inteligencja',
  archaeology: 'Archeologia',
  language: 'Język',
  culture: 'Kultura',
  art: 'Sztuka',
  music: 'Muzyka',
  sport: 'Sport',
  animals: 'Zwierzęta',
  plants: 'Rośliny',
  society: 'Społeczeństwo',
  economy: 'Ekonomia',
  inventions: 'Wynalazki',
  earth: 'Ziemia',
  human: 'Człowiek',
};

// --- Deterministyczna "ciekawostka dnia" — musi być identyczna z logiką
// w src/utils/text.ts (hashString) i src/services/factOfDay.ts. ---
function hashString(input) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getFactOfTheDay(facts, date = new Date()) {
  if (facts.length === 0) return null;
  return facts[hashString(dateKey(date)) % facts.length];
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(text) {
  return escapeHtml(text).replace(/'/g, '&#39;');
}

/**
 * Wstrzykuje meta tagi (title/description/canonical/OG/Twitter/robots/JSON-LD)
 * do szablonu index.html oraz — opcjonalnie — statyczną, czytelną treść do
 * wnętrza <div id="root">, którą React nadpisze własnym renderem po
 * uruchomieniu JS (bezpieczne z `createRoot`, w przeciwieństwie do
 * `hydrateRoot` nie porównuje istniejącego DOM, więc nie ma ostrzeżeń
 * o niezgodności hydratacji).
 */
function renderPage(template, { title, description, urlPath, robots, jsonLd, bodyHtml }) {
  let html = template;

  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);

  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeAttr(description)}" />`,
  );

  const canonicalUrl = `${SITE_URL}${urlPath}`;
  const extraTags = [
    `<link rel="canonical" href="${canonicalUrl}" />`,
    `<meta name="robots" content="${robots || 'index, follow'}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:site_name" content="Ciekawostki" />`,
    `<meta property="og:locale" content="pl_PL" />`,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:image" content="${SITE_URL}/icons/icon-512.png" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(description)}" />`,
    `<meta name="twitter:image" content="${SITE_URL}/icons/icon-512.png" />`,
  ];
  if (jsonLd) {
    extraTags.push(`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`);
  }
  html = html.replace('</head>', `${extraTags.join('\n    ')}\n  </head>`);

  if (bodyHtml) {
    html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
  }

  return html;
}

function factJsonLd(fact, urlPath) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: fact.title,
    description: fact.content,
    articleBody: `${fact.content} ${fact.explanation}`,
    about: fact.category,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${urlPath}` },
    author: { '@type': 'Organization', name: 'Ciekawostki' },
    publisher: { '@type': 'Organization', name: 'Ciekawostki' },
    isAccessibleForFree: true,
  };
}

function factBodyHtml(fact, urlPath) {
  return `
    <article>
      <p>${escapeHtml(CATEGORY_LABELS[fact.category] || fact.category)}</p>
      <h1>${escapeHtml(fact.title)}</h1>
      <p>${escapeHtml(fact.content)}</p>
      <p>${escapeHtml(fact.explanation)}</p>
      <p>Źródło: ${escapeHtml(fact.source)} — <a href="${escapeAttr(fact.sourceUrl)}">${escapeAttr(fact.sourceUrl)}</a></p>
      <p><a href="${escapeAttr(urlPath)}">Zobacz na Ciekawostki.pl</a></p>
    </article>
  `.trim();
}

async function writeStaticPage(relativeDir, html) {
  const dir = path.join(DIST_DIR, relativeDir);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), html, 'utf-8');
}

async function main() {
  const facts = JSON.parse(await readFile(FACTS_FILE, 'utf-8'));
  const template = await readFile(path.join(DIST_DIR, 'index.html'), 'utf-8');

  const urls = [];

  // --- Strona główna: aktualizujemy meta wprost w dist/index.html. ---
  const homeHtml = renderPage(template, {
    title: 'Ciekawostki — losowe, zweryfikowane fakty ze świata nauki i nie tylko',
    description:
      'Codzienna dawka zaskakujących, zweryfikowanych ciekawostek z nauki, kosmosu, historii, psychologii i wielu innych dziedzin. Bez rejestracji, działa offline.',
    urlPath: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Ciekawostki',
      url: SITE_URL,
    },
  });
  await writeFile(path.join(DIST_DIR, 'index.html'), homeHtml, 'utf-8');
  urls.push({ loc: '/', priority: '1.0' });

  // --- Szukaj: ogólna, statyczna powłoka (wyniki dobierane są w przeglądarce). ---
  const searchHtml = renderPage(template, {
    title: 'Szukaj ciekawostek — Ciekawostki',
    description:
      'Przeszukuj i filtruj setki zweryfikowanych ciekawostek według kategorii i poziomu zaskoczenia.',
    urlPath: '/szukaj',
  });
  await writeStaticPage('szukaj', searchHtml);
  urls.push({ loc: '/szukaj', priority: '0.5' });

  // --- Ciekawostka dnia: deterministyczna dla dnia builda; JS po stronie
  // klienta i tak przeliczy właściwą ciekawostkę na bieżąco każdego dnia. ---
  const factOfDay = getFactOfTheDay(facts);
  if (factOfDay) {
    const dayHtml = renderPage(template, {
      title: `Ciekawostka dnia: ${factOfDay.title} — Ciekawostki`,
      description: factOfDay.content,
      urlPath: '/dzien',
      jsonLd: factJsonLd(factOfDay, '/dzien'),
      bodyHtml: factBodyHtml(factOfDay, factPath(factOfDay.id)),
    });
    await writeStaticPage('dzien', dayHtml);
  }
  urls.push({ loc: '/dzien', priority: '0.6' });

  // --- Każda ciekawostka dostaje własną, statyczną, indeksowalną stronę. ---
  for (const fact of facts) {
    const urlPath = factPath(fact.id);
    const html = renderPage(template, {
      title: `${fact.title} — Ciekawostki`,
      description: fact.content,
      urlPath,
      jsonLd: factJsonLd(fact, urlPath),
      bodyHtml: factBodyHtml(fact, urlPath),
    });
    await writeStaticPage(`ciekawostka/${fact.id}`, html);
    urls.push({ loc: urlPath, priority: '0.8' });
  }

  // --- sitemap.xml ---
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      (u) => `  <url><loc>${SITE_URL}${u.loc}</loc><priority>${u.priority}</priority></url>`,
    ),
    '</urlset>',
  ].join('\n');
  await writeFile(path.join(DIST_DIR, 'sitemap.xml'), sitemap, 'utf-8');

  // --- robots.txt: dopisz odnośnik do sitemapy i wyłącz strony personalne. ---
  const robotsPath = path.join(DIST_DIR, 'robots.txt');
  const robotsBase = await readFile(robotsPath, 'utf-8').catch(() => 'User-agent: *\nAllow: /\n');
  const robotsTxt = `${robotsBase.trim()}\nDisallow: /ulubione\nDisallow: /historia\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  await writeFile(robotsPath, robotsTxt, 'utf-8');

  console.log(`Prerenderowano ${facts.length} stron ciekawostek + strony statyczne.`);
  console.log(`sitemap.xml: ${urls.length} adresów (SITE_URL=${SITE_URL})`);
}

function factPath(id) {
  return `/ciekawostka/${id}`;
}

main();
