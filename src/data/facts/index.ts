import type { Fact } from '@/types/fact';

/**
 * Automatyczne wykrywanie wszystkich plików `*.facts.json` w tym katalogu.
 *
 * To jest kluczowy element architektury: aby dodać kolejne setki lub tysiące
 * ciekawostek, wystarczy wrzucić nowy plik `nazwa.facts.json` do tego
 * folderu (np. wygenerowany przez `scripts/generate-facts.mjs`) – Vite
 * automatycznie włączy go do bundla dzięki `import.meta.glob`, bez
 * jakiejkolwiek zmiany w kodzie aplikacji.
 */
const modules = import.meta.glob<{ default: Fact[] }>('./*.facts.json', {
  eager: true,
});

/** Surowa lista ciekawostek ze wszystkich plików, przed walidacją/dedupem. */
export const rawFactBatches: Fact[][] = Object.values(modules).map(
  (mod) => mod.default,
);
