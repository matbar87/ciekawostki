import { Link } from 'react-router-dom';
import { Copy, ExternalLink, Link2, Star } from 'lucide-react';
import type { Fact } from '@/types/fact';
import { CategoryChip } from './CategoryChip';
import { SurpriseMeter } from './SurpriseMeter';
import { copyFactToClipboard } from '@/services/share';
import { factPath } from '@/utils/routes';
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
        <span className={styles.title}>{fact.title}</span>
        <CategoryChip category={fact.category} size="small" />
        <span className={styles.snippet}>{fact.content}</span>
      </summary>

      <div className={styles.body}>
        <SurpriseMeter level={fact.surpriseLevel} />
        <p className={styles.fullContent}>{fact.content}</p>
        <p className={styles.explanation}>{fact.explanation}</p>
        <a href={fact.sourceUrl} target="_blank" rel="noreferrer noopener" className={styles.sourceLink}>
          Źródło: {fact.source}
          <ExternalLink size={13} aria-hidden="true" strokeWidth={2} />
        </a>
        <div className={styles.actions}>
          <Link to={factPath(fact.id)} className={styles.iconAction} aria-label="Otwórz stałą stronę tej ciekawostki">
            <Link2 size={17} aria-hidden="true" strokeWidth={2} />
          </Link>
          <button
            type="button"
            className={[styles.iconAction, isFavorite ? styles.favoriteActive : ''].join(' ')}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
            onClick={onToggleFavorite}
          >
            <Star size={17} aria-hidden="true" strokeWidth={2} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            className={styles.iconAction}
            aria-label="Kopiuj ciekawostkę"
            onClick={() => copyFactToClipboard(fact)}
          >
            <Copy size={17} aria-hidden="true" strokeWidth={2} />
          </button>
        </div>
      </div>
    </details>
  );
}
