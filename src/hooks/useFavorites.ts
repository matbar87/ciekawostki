import { useMemo } from 'react';
import { getFactById } from '@/services/factsRepository';
import { useAppState } from './useAppState';

/** Lista ulubionych ciekawostek (pełne rekordy), posortowana od najnowszych. */
export function useFavorites() {
  const { favoriteIds, toggleFavorite, isFavorite } = useAppState();

  const favorites = useMemo(
    () =>
      Array.from(favoriteIds)
        .map((id) => getFactById(id))
        .filter((fact): fact is NonNullable<typeof fact> => fact !== undefined),
    [favoriteIds],
  );

  return { favorites, toggleFavorite, isFavorite };
}
