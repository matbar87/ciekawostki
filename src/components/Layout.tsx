import { Outlet } from 'react-router-dom';
import { TopAppBar } from './TopAppBar';
import { InstallPrompt } from './InstallPrompt';
import { Footer } from './Footer';
import styles from './Layout.module.css';

export function Layout() {
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
    </>
  );
}
