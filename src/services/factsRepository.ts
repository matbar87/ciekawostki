import { rawFactBatches } from '@/data/facts';
import { REQUIRED_FACT_FIELDS, type Fact } from '@/types/fact';
import { normalizeForComparison } from '@/utils/text';

function isValidFact(candidate: Partial<Fact>): candidate is Fact {
  return REQUIRED_FACT_FIELDS.every((field) => {
    const value = candidate[field];
    return value !== undefined && value !== null && value !== '';
  });
}

/**
 * Scala wszystkie partie ciekawostek wykryte w `src/data/facts`, odrzuca
 * niekompletne rekordy i usuwa duplikaty (po `id` oraz po znormalizowanej
 * treści, na wypadek gdyby dwie partie opisały ten sam fakt innymi słowami
 * pod różnym id). Wykonywane raz, przy pierwszym imporcie modułu.
 */
function buildFactDatabase(): Fact[] {
  const seenIds = new Set<string>();
  const seenContent = new Set<string>();
  const facts: Fact[] = [];

  for (const batch of rawFactBatches) {
    for (const candidate of batch) {
      if (!isValidFact(candidate)) {
        console.warn('[factsRepository] Pominięto niekompletny rekord:', candidate);
        continue;
      }
      if (seenIds.has(candidate.id)) {
        console.warn(`[factsRepository] Pominięto duplikat id="${candidate.id}"`);
        continue;
      }
      const normalizedContent = normalizeForComparison(candidate.content);
      if (seenContent.has(normalizedContent)) {
        console.warn(`[factsRepository] Pominięto duplikat treści dla id="${candidate.id}"`);
        continue;
      }
      seenIds.add(candidate.id);
      seenContent.add(normalizedContent);
      facts.push(candidate);
    }
  }

  return facts;
}

let cachedFacts: Fact[] | null = null;

/** Zwraca pełną, zwalidowaną i zdeduplikowaną bazę ciekawostek (cache w pamięci). */
export function getAllFacts(): Fact[] {
  if (!cachedFacts) {
    cachedFacts = buildFactDatabase();
  }
  return cachedFacts;
}

export function getFactById(id: string): Fact | undefined {
  return getAllFacts().find((fact) => fact.id === id);
}
