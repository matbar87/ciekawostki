import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, ExternalLink, Link2, Share2, Star } from 'lucide-react';
import type { Fact } from '@/types/fact';
import { CategoryChip } from './CategoryChip';
import { SurpriseMeter } from './SurpriseMeter';
import { formatReadingTime } from '@/utils/format';
import { canShare, copyFactToClipboard, shareFact } from '@/services/share';
import { factPath } from '@/utils/routes';
import styles from './FactCard.module.css';

interface FactCardProps {
  fact: Fact;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  /** Poziom nagłówka tytułu – h1 na ekranie głównym, h2 w listach/podglądach. */
  headingLevel?: 'h1' | 'h2';
  /** Dodatkowa etykieta nad kartą, np. znacznik czasu w historii. */
  overline?: string;
  /** Czy pokazać link do stałej strony ciekawostki (ukryty np. na samej stronie szczegółów). */
  showPermalink?: boolean;
}

export function FactCard({
  fact,
  isFavorite,
  onToggleFavorite,
  headingLevel = 'h1',
  overline,
  showPermalink = true,
}: FactCardProps) {
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
      <p className={styles.explanation}>{fact.explanation}</p>
      <a className={styles.sourceLink} href={fact.sourceUrl} target="_blank" rel="noreferrer noopener">
        Źródło: {fact.source}
        <ExternalLink size={14} aria-hidden="true" strokeWidth={2} />
      </a>

      <footer className={styles.footer}>
        <span className={styles.readingTime}>{formatReadingTime(fact.readingTimeSeconds)}</span>

        <div className={styles.actions}>
          {showPermalink && (
            <Link
              to={factPath(fact.id)}
              className={styles.iconAction}
              aria-label="Otwórz stałą stronę tej ciekawostki"
            >
              <Link2 size={18} aria-hidden="true" strokeWidth={2} />
            </Link>
          )}
          <button
            type="button"
            className={[styles.iconAction, isFavorite ? styles.favoriteActive : ''].join(' ')}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
            onClick={onToggleFavorite}
          >
            <Star size={18} aria-hidden="true" strokeWidth={2} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button type="button" className={styles.iconAction} aria-label="Kopiuj ciekawostkę" onClick={handleCopy}>
            <Copy size={18} aria-hidden="true" strokeWidth={2} />
          </button>
          {canShare() && (
            <button type="button" className={styles.iconAction} aria-label="Udostępnij ciekawostkę" onClick={handleShare}>
              <Share2 size={18} aria-hidden="true" strokeWidth={2} />
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
