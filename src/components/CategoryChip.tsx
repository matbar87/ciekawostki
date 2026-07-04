import { CATEGORIES } from '@/data/categories';
import type { CategoryId } from '@/types/fact';
import { CategoryIcon } from './CategoryIcon';
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
  const iconSize = size === 'small' ? 13 : 15;
  const className = [styles.chip, size === 'small' ? styles.small : '', selected ? styles.selected : '']
    .filter(Boolean)
    .join(' ');

  if (!onClick) {
    return (
      <span className={className}>
        <CategoryIcon category={category} size={iconSize} />
        {meta.label}
      </span>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick} aria-pressed={selected}>
      <CategoryIcon category={category} size={iconSize} />
      {meta.label}
    </button>
  );
}
