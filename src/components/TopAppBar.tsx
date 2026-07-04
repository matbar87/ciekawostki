import { NavLink } from 'react-router-dom';
import { useAppState } from '@/hooks/useAppState';
import { useTheme } from '@/hooks/useTheme';
import { IconButton } from './IconButton';
import styles from './TopAppBar.module.css';

const THEME_CYCLE: Record<string, 'light' | 'dark' | 'system'> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
};

const THEME_ICON: Record<string, string> = {
  system: '🌓',
  light: '☀️',
  dark: '🌙',
};

const THEME_LABEL: Record<string, string> = {
  system: 'Motyw: systemowy (kliknij, aby ustawić jasny)',
  light: 'Motyw: jasny (kliknij, aby ustawić ciemny)',
  dark: 'Motyw: ciemny (kliknij, aby ustawić systemowy)',
};

export function TopAppBar() {
  const { filteredFacts, discoveredCount } = useAppState();
  const { theme, setTheme } = useTheme();
  const total = filteredFacts.length;

  return (
    <header className={styles.bar}>
      <NavLink to="/" className={styles.brand} end>
        <span aria-hidden="true">💡</span>
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
          <span aria-hidden="true">🔍</span>
          <span className="visually-hidden">Szukaj i filtruj</span>
        </NavLink>
        <NavLink
          to="/ulubione"
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          <span aria-hidden="true">★</span>
          <span className="visually-hidden">Ulubione</span>
        </NavLink>
        <NavLink
          to="/historia"
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          <span aria-hidden="true">🕘</span>
          <span className="visually-hidden">Historia</span>
        </NavLink>
        <NavLink
          to="/dzien"
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          <span aria-hidden="true">📅</span>
          <span className="visually-hidden">Ciekawostka dnia</span>
        </NavLink>
        <IconButton
          label={THEME_LABEL[theme]}
          onClick={() => setTheme(THEME_CYCLE[theme])}
        >
          {THEME_ICON[theme]}
        </IconButton>
      </nav>
    </header>
  );
}
