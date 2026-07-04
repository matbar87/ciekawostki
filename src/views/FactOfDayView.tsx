import { useEffect } from 'react';
import { CalendarX } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import { useFactOfDay } from '@/hooks/useFactOfDay';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { FactCard } from '@/components/FactCard';
import { EmptyState } from '@/components/EmptyState';
import styles from './ListView.module.css';

const TODAY_LABEL = new Intl.DateTimeFormat('pl-PL', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(new Date());

export function FactOfDayView() {
  const fact = useFactOfDay();
  const { isFavorite, toggleFavorite, recordView } = useAppState();

  useDocumentMeta(
    fact ? `Ciekawostka dnia: ${fact.title} — Ciekawostki` : 'Ciekawostka dnia — Ciekawostki',
    fact?.content ?? 'Nowa, zweryfikowana ciekawostka na każdy dzień.',
  );

  useEffect(() => {
    if (fact) recordView(fact.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fact?.id]);

  if (!fact) {
    return <EmptyState icon={CalendarX} title="Brak danych" description="Baza ciekawostek jest pusta." />;
  }

  return (
    <div className={styles.list}>
      <h1 className={styles.heading}>Ciekawostka dnia – {TODAY_LABEL}</h1>
      <FactCard
        fact={fact}
        headingLevel="h2"
        isFavorite={isFavorite(fact.id)}
        onToggleFavorite={() => toggleFavorite(fact.id)}
      />
    </div>
  );
}
