import { CATEGORIES } from '@/data/categories';
import type { CategoryId } from '@/types/fact';
import styles from './CategoryChip.module.css';

interface CategoryChipProps {
  category: CategoryId;
  selected?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium';
}

/** Etykieta kategorii z ikoną; może działać jako statyczny tag lub klikalny filtr. */
export function CategoryChip({ category, selected, onClick, size = 'medium' }: CategoryChipProps) {
  const meta = CATEGORIES[category];
  const className = [styles.chip, size === 'small' ? styles.small : '', selected ? styles.selected : '']
    .filter(Boolean)
    .join(' ');

  if (!onClick) {
    return (
      <span className={className}>
        <span aria-hidden="true">{meta.icon}</span>
        {meta.label}
      </span>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick} aria-pressed={selected}>
      <span aria-hidden="true">{meta.icon}</span>
      {meta.label}
    </button>
  );
}
