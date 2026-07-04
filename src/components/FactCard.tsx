import { useState } from 'react';
import type { Fact } from '@/types/fact';
import { CategoryChip } from './CategoryChip';
import { SurpriseMeter } from './SurpriseMeter';
import { formatReadingTime } from '@/utils/format';
import { canShare, copyFactToClipboard, shareFact } from '@/services/share';
import styles from './FactCard.module.css';

interface FactCardProps {
  fact: Fact;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  /** Poziom nagłówka tytułu – h1 na ekranie głównym, h2 w listach/podglądach. */
  headingLevel?: 'h1' | 'h2';
  /** Dodatkowa etykieta nad kartą, np. znacznik czasu w historii. */
  overline?: string;
}

export function FactCard({
  fact,
  isFavorite,
  onToggleFavorite,
  headingLevel = 'h1',
  overline,
}: FactCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const Heading = headingLevel;

  async function handleCopy() {
    const success = await copyFactToClipboard(fact);
    setStatusMessage(success ? 'Skopiowano ciekawostkę do schowka.' : 'Nie udało się skopiować.');
  }

  async function handleShare() {
    const success = await shareFact(fact);
    if (!success) {
      const copied = await copyFactToClipboard(fact);
      setStatusMessage(
        copied ? 'Udostępnianie niedostępne – skopiowano zamiast tego.' : 'Nie udało się udostępnić.',
      );
    }
  }

  return (
    <article className={styles.card} key={fact.id} aria-label="Ciekawostka">
      {overline && <p className={styles.overline}>{overline}</p>}
      <div className={styles.meta}>
        <CategoryChip category={fact.category} />
        <SurpriseMeter level={fact.surpriseLevel} />
      </div>

      <Heading className={styles.title}>{fact.title}</Heading>
      <p className={styles.content}>{fact.content}</p>

      <div className={styles.expandSection}>
        <button
          type="button"
          className={styles.expandButton}
          aria-expanded={isExpanded}
          aria-controls={`explanation-${fact.id}`}
          onClick={() => setIsExpanded((v) => !v)}
        >
          {isExpanded ? 'Zwiń ▲' : 'Czytaj dalej ▼'}
        </button>

        {isExpanded && (
          <div id={`explanation-${fact.id}`} className={styles.explanation}>
            <p>{fact.explanation}</p>
            <a
              className={styles.sourceLink}
              href={fact.sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              Źródło: {fact.source} ↗
            </a>
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <span className={styles.readingTime}>
          {formatReadingTime(fact.readingTimeSeconds)}
        </span>

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
          <button type="button" className={styles.iconAction} aria-label="Kopiuj ciekawostkę" onClick={handleCopy}>
            ⧉
          </button>
          {canShare() && (
            <button type="button" className={styles.iconAction} aria-label="Udostępnij ciekawostkę" onClick={handleShare}>
              ⇪
            </button>
          )}
        </div>
      </footer>

      <p role="status" className="visually-hidden">
        {statusMessage}
      </p>
    </article>
  );
}
