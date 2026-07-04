import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Fact } from '@/types/fact';
import { DEFAULT_SETTINGS, type UserSettings } from '@/types/settings';
import { getAllFacts } from '@/services/factsRepository';
import {
  addFavorite,
  getFavoriteIds,
  getHistory,
  getSeenEverIds,
  loadSettings,
  markSeen,
  pushHistory,
  removeFavorite,
  saveSettings,
  type HistoryRecord,
} from '@/services/db';

interface AppState {
  /** Cała, zwalidowana baza ciekawostek (stała w czasie życia aplikacji). */
  facts: Fact[];
  /** Pula ciekawostek po zastosowaniu ustawień (ukryte kategorie, tylko zaskakujące). */
  filteredFacts: Fact[];
  settings: UserSettings;
  isReady: boolean;
  favoriteIds: Set<string>;
  history: HistoryRecord[];
  discoveredCount: number;
  updateSettings: (patch: Partial<UserSettings>) => void;
  toggleFavorite: (factId: string) => void;
  isFavorite: (factId: string) => boolean;
  /** Odnotowuje wyświetlenie ciekawostki: dopisuje do historii i licznika odkryć. */
  recordView: (factId: string) => void;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const facts = useMemo(() => getAllFacts(), []);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [discoveredCount, setDiscoveredCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      const [loadedSettings, favorites, historyRecords, seenIds] = await Promise.all([
        loadSettings(),
        getFavoriteIds(),
        getHistory(),
        getSeenEverIds(),
      ]);
      if (cancelled) return;
      setSettings(loadedSettings);
      setFavoriteIds(new Set(favorites));
      setHistory(historyRecords);
      setDiscoveredCount(seenIds.size);
      setIsReady(true);
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((factId: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(factId)) {
        next.delete(factId);
        removeFavorite(factId);
      } else {
        next.add(factId);
        addFavorite(factId);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((factId: string) => favoriteIds.has(factId), [favoriteIds]);

  const recordView = useCallback((factId: string) => {
    pushHistory(factId);
    setHistory((prev) => [{ factId, viewedAt: Date.now() }, ...prev].slice(0, 20));
    markSeen(factId).then((seen) => setDiscoveredCount(seen.size));
  }, []);

  const filteredFacts = useMemo(() => {
    const hidden = new Set(settings.hiddenCategories);
    return facts.filter((fact) => {
      if (hidden.has(fact.category)) return false;
      if (settings.onlyMostSurprising && fact.surpriseLevel < 4) return false;
      return true;
    });
  }, [facts, settings.hiddenCategories, settings.onlyMostSurprising]);

  const value: AppState = {
    facts,
    filteredFacts,
    settings,
    isReady,
    favoriteIds,
    history,
    discoveredCount,
    updateSettings,
    toggleFavorite,
    isFavorite,
    recordView,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState musi być używany wewnątrz <AppStateProvider>.');
  }
  return ctx;
}
