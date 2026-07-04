import { useMemo } from 'react';
import { getFactOfTheDay } from '@/services/factOfDay';
import { useAppState } from './useAppState';

/** Zwraca deterministyczną "ciekawostkę dnia", niezależną od filtrów użytkownika. */
export function useFactOfDay() {
  const { facts } = useAppState();
  return useMemo(() => getFactOfTheDay(facts), [facts]);
}
