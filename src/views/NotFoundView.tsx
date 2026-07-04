import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { EmptyState } from '@/components/EmptyState';
import { ROUTES } from '@/utils/routes';
import styles from './ListView.module.css';

export function NotFoundView() {
  useDocumentMeta('Nie znaleziono strony — Ciekawostki', 'Ta strona nie istnieje.');

  return (
    <div className={styles.list}>
      <EmptyState
        icon={Compass}
        title="Nie znaleziono tej strony"
        description="Ciekawostka mogła zostać usunięta albo link jest nieprawidłowy."
      />
      <Link to={ROUTES.home} className={styles.homeLink}>
        Wróć na stronę główną
      </Link>
    </div>
  );
}
