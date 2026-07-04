import { NavLink } from 'react-router-dom';
import { CalendarDays, History as HistoryIcon, Lightbulb, Monitor, Moon, Search, Star, Sun } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import { useTheme } from '@/hooks/useTheme';
import { IconButton } from './IconButton';
import styles from './TopAppBar.module.css';

const THEME_CYCLE: Record<string, 'light' | 'dark' | 'system'> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
};

const THEME_ICON = {
  system: Monitor,
  light: Sun,
  dark: Moon,
} as const;

const THEME_LABEL: Record<string, string> = {
  system: 'Motyw: systemowy (kliknij, aby ustawić jasny)',
  light: 'Motyw: jasny (kliknij, aby ustawić ciemny)',
  dark: 'Motyw: ciemny (kliknij, aby ustawić systemowy)',
};

export function TopAppBar() {
  const { filteredFacts, discoveredCount } = useAppState();
  const { theme, setTheme } = useTheme();
  const total = filteredFacts.length;
  const ThemeIcon = THEME_ICON[theme];

  return (
    <header className={styles.bar}>
      <NavLink to="/" className={styles.brand} end>
        <Lightbulb size={22} aria-hidden="true" strokeWidth={2} />
        <span>Ciekawostki</span>
      </NavLink>

      <p className={styles.counter} aria-live="polite">
        Odkryto {Math.min(discoveredCount, total)} / {total}
      </p>

      <nav className={styles.nav} aria-label="Nawigacja główna">
        <NavLink
          to="/szukaj"
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          <Search size={20} aria-hidden="true" strokeWidth={2} />
          <span className="visually-hidden">Szukaj i filtruj</span>
        </NavLink>
        <NavLink
          to="/ulubione"
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          <Star size={20} aria-hidden="true" strokeWidth={2} />
          <span className="visually-hidden">Ulubione</span>
        </NavLink>
        <NavLink
          to="/historia"
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          <HistoryIcon size={20} aria-hidden="true" strokeWidth={2} />
          <span className="visually-hidden">Historia</span>
        </NavLink>
        <NavLink
          to="/dzien"
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          <CalendarDays size={20} aria-hidden="true" strokeWidth={2} />
          <span className="visually-hidden">Ciekawostka dnia</span>
        </NavLink>
        <IconButton label={THEME_LABEL[theme]} onClick={() => setTheme(THEME_CYCLE[theme])}>
          <ThemeIcon size={20} aria-hidden="true" strokeWidth={2} />
        </IconButton>
      </nav>
    </header>
  );
}
