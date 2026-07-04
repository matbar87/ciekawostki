import { Outlet, useLocation } from 'react-router-dom';
import { TopAppBar } from './TopAppBar';
import { InstallPrompt } from './InstallPrompt';
import { Footer } from './Footer';
import { ROUTES } from '@/utils/routes';
import styles from './Layout.module.css';

export function Layout() {
  const { pathname } = useLocation();
  // Ekran główny ma przypięty na stałe przycisk "Wylosuj kolejną" tuż nad
  // dolną krawędzią ekranu — rezerwujemy pod nim miejsce za stopką, żeby
  // przycisk nigdy nie zasłaniał jej linków, nawet przy krótkiej treści.
  const reserveDrawButtonSpace = pathname === ROUTES.home;

  return (
    <>
      <a href="#main-content" className="skip-link">
        Przejdź do treści głównej
      </a>
      <TopAppBar />
      <main id="main-content" className={styles.main} tabIndex={-1}>
        <InstallPrompt />
        <Outlet />
      </main>
      <Footer />
      {reserveDrawButtonSpace && <div className={styles.drawButtonSpacer} aria-hidden="true" />}
    </>
  );
}
