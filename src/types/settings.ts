import type { CategoryId } from './fact';

export type ThemeMode = 'light' | 'dark' | 'system';

/** Ustawienia użytkownika przechowywane trwale w IndexedDB. */
export interface UserSettings {
  theme: ThemeMode;
  /** Kategorie ukryte przez użytkownika – nie pojawiają się w losowaniu. */
  hiddenCategories: CategoryId[];
  /** Gdy true, losowanie i przeglądanie ograniczają się do surpriseLevel >= 4. */
  onlyMostSurprising: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  hiddenCategories: [],
  onlyMostSurprising: false,
};
