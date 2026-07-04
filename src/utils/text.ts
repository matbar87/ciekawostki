/** Normalizuje tekst do porównań deduplikacyjnych (bez diakrytyków, wielkości liter, spacji). */
export function normalizeForComparison(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Prosty, deterministyczny hash 32-bitowy (FNV-1a) używany do losowania opartego na dacie/seedzie. */
export function hashString(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}
