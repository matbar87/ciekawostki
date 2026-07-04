import type { Fact } from '@/types/fact';
import { hashString } from '@/utils/text';

/** Format YYYY-MM-DD w lokalnej strefie czasowej użytkownika. */
function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Wyznacza "ciekawostkę dnia" w sposób deterministyczny: ta sama data zawsze
 * daje ten sam wynik (dla tej samej wersji bazy), niezależnie od stanu
 * losowania użytkownika. Dzięki temu funkcja jest odtwarzalna i nie wymaga
 * backendu ani synchronizacji między urządzeniami.
 */
export function getFactOfTheDay(pool: readonly Fact[], date: Date = new Date()): Fact | null {
  if (pool.length === 0) return null;
  const index = hashString(dateKey(date)) % pool.length;
  return pool[index];
}
