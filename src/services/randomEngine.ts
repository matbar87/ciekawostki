import type { Fact } from '@/types/fact';
import { shuffle } from '@/utils/seededRandom';
import { getShuffleQueue, saveShuffleQueue } from './db';

/**
 * Losowanie "bez powtórzeń aż do wyczerpania puli" (shuffle bag).
 *
 * Stan talii (kolejność jeszcze nie pokazanych id) jest trwale zapisywany
 * w IndexedDB, więc działa poprawnie także po odświeżeniu strony. Talia
 * jest odporna na zmianę filtrów (ukryte kategorie / tylko zaskakujące)
 * między losowaniami – identyfikatory spoza aktualnej puli są po prostu
 * pomijane, a nie tracone, więc po wyłączeniu filtra wracają do gry.
 */
export async function drawNextFact(pool: Fact[], excludeId?: string): Promise<Fact | null> {
  if (pool.length === 0) return null;

  const poolIds = new Set(pool.map((f) => f.id));
  let queue = await getShuffleQueue();

  // Odsiej z talii identyfikatory, których obecnie nie ma w aktywnej puli.
  queue = queue.filter((id) => poolIds.has(id));

  if (queue.length === 0) {
    queue = shuffle(Array.from(poolIds));
    // Unikaj natychmiastowego powtórzenia tej samej ciekawostki po
    // wyczerpaniu talii, jeśli to możliwe.
    if (excludeId && queue[0] === excludeId && queue.length > 1) {
      [queue[0], queue[1]] = [queue[1], queue[0]];
    }
  }

  const nextId = queue.shift() as string;
  await saveShuffleQueue(queue);

  return pool.find((f) => f.id === nextId) ?? null;
}
