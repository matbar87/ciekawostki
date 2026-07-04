import { Star } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { FactCard } from '@/components/FactCard';
import { EmptyState } from '@/components/EmptyState';
import styles from './ListView.module.css';

export function FavoritesView() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Strona personalna (zależna od danych w przeglądarce użytkownika) — nie ma
  // sensu jej indeksować, więc jawnie oznaczamy noindex.
  useDocumentMeta('Ulubione — Ciekawostki', undefined, { noindex: true });

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={Star}
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
