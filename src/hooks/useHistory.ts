import { useMemo } from 'react';
import { getFactById } from '@/services/factsRepository';
import { useAppState } from './useAppState';

export interface HistoryEntry {
  fact: import('@/types/fact').Fact;
  viewedAt: number;
}

/** Historia ostatnio wyświetlonych ciekawostek (najnowsze pierwsze), z pełnymi rekordami. */
export function useHistory() {
  const { history } = useAppState();

  const entries = useMemo<HistoryEntry[]>(
    () =>
      history
        .map((record) => {
          const fact = getFactById(record.factId);
          return fact ? { fact, viewedAt: record.viewedAt } : null;
        })
        .filter((entry): entry is HistoryEntry => entry !== null),
    [history],
  );

  return { entries };
}
