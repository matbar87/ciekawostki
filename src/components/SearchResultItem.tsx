import type { Fact } from '@/types/fact';
import { CategoryChip } from './CategoryChip';
import { SurpriseMeter } from './SurpriseMeter';
import { copyFactToClipboard } from '@/services/share';
import styles from './SearchResultItem.module.css';

interface SearchResultItemProps {
  fact: Fact;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
}

/**
 * Zwarty wynik wyszukiwania oparty na natywnym elemencie <details> –
 * rozwijanie/zwijanie działa bez JavaScriptu i jest w pełni dostępne
 * z klawiatury oraz dla czytników ekranu.
 */
export function SearchResultItem({ fact, isFavorite, onToggleFavorite, onOpen }: SearchResultItemProps) {
  return (
    <details className={styles.item} onToggle={(e) => e.currentTarget.open && onOpen()}>
      <summary className={styles.summary}>
        <span className={styles.summaryText}>
          <span className={styles.title}>{fact.title}</span>
          <span className={styles.snippet}>{fact.content}</span>
        </span>
        <CategoryChip category={fact.category} size="small" />
      </summary>

      <div className={styles.body}>
        <SurpriseMeter level={fact.surpriseLevel} />
        <p className={styles.explanation}>{fact.explanation}</p>
        <a href={fact.sourceUrl} target="_blank" rel="noreferrer noopener" className={styles.sourceLink}>
          Źródło: {fact.source} ↗
        </a>
        <div className={styles.actions}>
          <button
            type="button"
            className={[styles.iconAction, isFavorite ? styles.favoriteActive : ''].join(' ')}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
            onClick={onToggleFavorite}
          >
            {isFavorite ? '★' : '☆'}
          </button>
          <button
            type="button"
            className={styles.iconAction}
            aria-label="Kopiuj ciekawostkę"
            onClick={() => copyFactToClipboard(fact)}
          >
            ⧉
          </button>
        </div>
      </div>
    </details>
  );
}
