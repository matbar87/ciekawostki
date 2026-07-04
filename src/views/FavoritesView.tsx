import { useFavorites } from '@/hooks/useFavorites';
import { FactCard } from '@/components/FactCard';
import { EmptyState } from '@/components/EmptyState';
import styles from './ListView.module.css';

export function FavoritesView() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon="⭐"
        title="Brak ulubionych ciekawostek"
        description="Dotknij gwiazdki przy ciekawostce, aby zapisać ją tutaj i wrócić do niej później."
      />
    );
  }

  return (
    <div className={styles.list}>
      <h1 className={styles.heading}>Ulubione ({favorites.length})</h1>
      {favorites.map((fact) => (
        <FactCard
          key={fact.id}
          fact={fact}
          headingLevel="h2"
          isFavorite={isFavorite(fact.id)}
          onToggleFavorite={() => toggleFavorite(fact.id)}
        />
      ))}
    </div>
  );
}
