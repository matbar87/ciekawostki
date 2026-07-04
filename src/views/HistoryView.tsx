import { useHistory } from '@/hooks/useHistory';
import { useAppState } from '@/hooks/useAppState';
import { FactCard } from '@/components/FactCard';
import { EmptyState } from '@/components/EmptyState';
import { formatRelativeTime } from '@/utils/format';
import styles from './ListView.module.css';

export function HistoryView() {
  const { entries } = useHistory();
  const { isFavorite, toggleFavorite } = useAppState();

  if (entries.length === 0) {
    return (
      <EmptyState
        icon="🕘"
        title="Historia jest pusta"
        description="Tutaj pojawi się do 20 ostatnio wyświetlonych ciekawostek."
      />
    );
  }

  return (
    <div className={styles.list}>
      <h1 className={styles.heading}>Historia (ostatnie {entries.length})</h1>
      {entries.map(({ fact, viewedAt }, index) => (
        <FactCard
          key={`${fact.id}-${viewedAt}-${index}`}
          fact={fact}
          headingLevel="h2"
          overline={formatRelativeTime(viewedAt)}
          isFavorite={isFavorite(fact.id)}
          onToggleFavorite={() => toggleFavorite(fact.id)}
        />
      ))}
    </div>
  );
}
