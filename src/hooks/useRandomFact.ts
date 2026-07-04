import { useCallback, useEffect, useRef, useState } from 'react';
import type { Fact } from '@/types/fact';
import { drawNextFact } from '@/services/randomEngine';
import { getLastFactId, saveLastFactId } from '@/services/db';
import { useAppState } from './useAppState';

interface UseRandomFactResult {
  currentFact: Fact | null;
  isLoading: boolean;
  drawNext: () => Promise<void>;
}

/**
 * Silnik głównego ekranu: przy pierwszym uruchomieniu przywraca ostatnio
 * widzianą ciekawostkę (jeśli nadal należy do aktywnej puli), a każde
 * kolejne wywołanie `drawNext` losuje bez powtórzeń zgodnie z talią
 * zarządzaną przez `randomEngine`.
 */
export function useRandomFact(): UseRandomFactResult {
  const { filteredFacts, isReady, recordView } = useAppState();
  const [currentFact, setCurrentFact] = useState<Fact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasRestored = useRef(false);

  const drawNext = useCallback(async () => {
    setIsLoading(true);
    const next = await drawNextFact(filteredFacts, currentFact?.id);
    setCurrentFact(next);
    if (next) {
      await saveLastFactId(next.id);
      recordView(next.id);
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredFacts, currentFact?.id]);

  useEffect(() => {
    if (!isReady || hasRestored.current) return;
    hasRestored.current = true;

    (async () => {
      const lastId = await getLastFactId();
      const restored = lastId ? filteredFacts.find((f) => f.id === lastId) : undefined;
      if (restored) {
        setCurrentFact(restored);
        setIsLoading(false);
      } else {
        await drawNext();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  return { currentFact, isLoading, drawNext };
}
