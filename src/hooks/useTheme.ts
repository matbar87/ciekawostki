import { useEffect } from 'react';
import { useAppState } from './useAppState';
import type { ThemeMode } from '@/types/settings';

/** Musi być identyczny z kluczem czytanym przez inline-skrypt w index.html. */
export const THEME_STORAGE_KEY = 'ciekawostki:theme';

function resolveEffectiveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
}

/**
 * Synchronizuje `settings.theme` z atrybutem `data-theme` na <html> i systemowym
 * motywem. Dodatkowo zapisuje wybór w localStorage (synchronicznie dostępnym),
 * żeby inline-skrypt w index.html mógł ustawić poprawny motyw jeszcze przed
 * pierwszym malowaniem strony — bez tego, przy motywie ciemnym systemu,
 * użytkownik widziałby krótki błysk jasnego motywu zanim IndexedDB zdąży się wczytać.
 */
export function useTheme() {
  const { settings, updateSettings } = useAppState();

  useEffect(() => {
    const apply = () => {
      document.documentElement.setAttribute('data-theme', resolveEffectiveTheme(settings.theme));
    };
    apply();
    localStorage.setItem(THEME_STORAGE_KEY, settings.theme);

    if (settings.theme !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [settings.theme]);

  return {
    theme: settings.theme,
    setTheme: (mode: ThemeMode) => updateSettings({ theme: mode }),
  };
}
