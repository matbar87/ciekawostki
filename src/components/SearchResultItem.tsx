import { Link } from 'react-router-dom';
import type { Fact } from '@/types/fact';
import { CategoryChip } from './CategoryChip';
import { factPath } from '@/utils/routes';
import styles from './SearchResultItem.module.css';

interface SearchResultItemProps {
  fact: Fact;
}

/** Zwarty wynik wyszukiwania: tylko kategoria i tytuł, prowadzi do pełnej strony ciekawostki. */
export function SearchResultItem({ fact }: SearchResultItemProps) {
  return (
    <Link to={factPath(fact.id)} className={styles.item}>
      <CategoryChip category={fact.category} size="small" />
      <span className={styles.title}>{fact.title}</span>
    </Link>
  );
}
