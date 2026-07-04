import { useEffect } from 'react';
import { useAppState } from './useAppState';
import type { ThemeMode } from '@/types/settings';

function resolveEffectiveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
}

/** Synchronizuje `settings.theme` z atrybutem `data-theme` na <html> i systemowym motywem. */
export function useTheme() {
  const { settings, updateSettings } = useAppState();

  useEffect(() => {
    const apply = () => {
      document.documentElement.setAttribute('data-theme', resolveEffectiveTheme(settings.theme));
    };
    apply();

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
