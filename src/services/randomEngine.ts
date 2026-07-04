import type { Fact } from '@/types/fact';
import { getShuffleSeenIds, saveShuffleSeenIds } from './db';

/**
 * Losowanie "bez powtórzeń aż do wyczerpania puli".
 *
 * Zamiast utrzymywać wcześniej potasowaną kolejkę (którą trzeba było
 * ręcznie oczyszczać ze "starych" id po zmianie filtrów), trzymamy zbiór
 * id-ków już pokazanych w bieżącym cyklu i przy każdym losowaniu liczymy
 * różnicę względem aktualnej, przefiltrowanej puli na żywo. Dzięki temu:
 * - wyłączenie/włączenie kategorii natychmiast zmienia dostępną pulę,
 *   bez czekania aż "stara" talia się wyczerpie,
 * - nowy cykl (reshuffle) zaczyna się dokładnie wtedy, gdy wszystkie
 *   ciekawostki z AKTUALNIE wybranych kategorii zostały zobaczone —
 *   a nie wtedy, gdy wyczerpie się jedna, węższa kategoria sprzed zmiany
 *   filtrów.
 */
export async function drawNextFact(pool: Fact[], excludeId?: string): Promise<Fact | null> {
  if (pool.length === 0) return null;

  const poolIds = pool.map((f) => f.id);
  let seen = await getShuffleSeenIds();

  let remaining = poolIds.filter((id) => !seen.has(id));

  if (remaining.length === 0) {
    // Cała aktualnie wybrana pula została zobaczona — nowy cykl od zera.
    seen = new Set();
    remaining = poolIds;
  }

  // Unikaj natychmiastowego powtórzenia tej samej ciekawostki, jeśli jest
  // inny kandydat do wyboru.
  const candidates =
    excludeId && remaining.length > 1 ? remaining.filter((id) => id !== excludeId) : remaining;

  const nextId = candidates[Math.floor(Math.random() * candidates.length)];
  seen.add(nextId);
  await saveShuffleSeenIds(seen);

  return pool.find((f) => f.id === nextId) ?? null;
}
