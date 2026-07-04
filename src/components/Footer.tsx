import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/routes';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.links} aria-label="Informacje prawne">
        <Link to={ROUTES.terms}>Regulamin</Link>
        <Link to={ROUTES.privacy}>Polityka prywatności</Link>
      </nav>
      <p className={styles.copy}>© {new Date().getFullYear()} Ciekawostki</p>
    </footer>
  );
}
