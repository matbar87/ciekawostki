import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFactById } from '@/services/factsRepository';
import { useAppState } from '@/hooks/useAppState';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { FactCard } from '@/components/FactCard';
import { NotFoundView } from './NotFoundView';
import styles from './ListView.module.css';

/**
 * Stała, bezpośrednio linkowalna strona pojedynczej ciekawostki
 * (`/ciekawostka/:id`). To właśnie te strony `scripts/prerender.mjs`
 * generuje statycznie dla każdego rekordu, żeby wyszukiwarki mogły
 * zaindeksować każdą ciekawostkę z osobna, niezależnie od losowania.
 */
export function FactDetailView() {
  const { id } = useParams<{ id: string }>();
  const fact = id ? getFactById(id) : undefined;
  const { isFavorite, toggleFavorite, recordView } = useAppState();

  useDocumentMeta(
    fact ? `${fact.title} — Ciekawostki` : 'Nie znaleziono ciekawostki — Ciekawostki',
    fact?.content,
  );

  useEffect(() => {
    if (fact) recordView(fact.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fact?.id]);

  if (!fact) {
    return <NotFoundView />;
  }

  return (
    <div className={styles.list}>
      <FactCard
        fact={fact}
        headingLevel="h1"
        isFavorite={isFavorite(fact.id)}
        onToggleFavorite={() => toggleFavorite(fact.id)}
        showPermalink={false}
      />
    </div>
  );
}
