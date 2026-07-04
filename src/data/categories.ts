import type { CategoryId } from '@/types/fact';

export interface CategoryMeta {
  id: CategoryId;
  /** Etykieta wyświetlana w interfejsie (po polsku). */
  label: string;
}

/**
 * Pojedyncze źródło prawdy o kategoriach. Dodanie nowej kategorii wymaga
 * wpisu tutaj, rozszerzenia unii `CategoryId` w `types/fact.ts` oraz dopisania
 * ikony w `components/CategoryIcon.tsx` – to jedyne miejsca, które trzeba zmienić.
 */
export const CATEGORIES: Record<CategoryId, CategoryMeta> = {
  science: { id: 'science', label: 'Nauka' },
  space: { id: 'space', label: 'Kosmos' },
  history: { id: 'history', label: 'Historia' },
  psychology: { id: 'psychology', label: 'Psychologia' },
  biology: { id: 'biology', label: 'Biologia' },
  medicine: { id: 'medicine', label: 'Medycyna' },
  physics: { id: 'physics', label: 'Fizyka' },
  chemistry: { id: 'chemistry', label: 'Chemia' },
  mathematics: { id: 'mathematics', label: 'Matematyka' },
  geography: { id: 'geography', label: 'Geografia' },
  technology: { id: 'technology', label: 'Technologia' },
  computerScience: { id: 'computerScience', label: 'Informatyka' },
  ai: { id: 'ai', label: 'Sztuczna inteligencja' },
  archaeology: { id: 'archaeology', label: 'Archeologia' },
  language: { id: 'language', label: 'Język' },
  culture: { id: 'culture', label: 'Kultura' },
  art: { id: 'art', label: 'Sztuka' },
  music: { id: 'music', label: 'Muzyka' },
  sport: { id: 'sport', label: 'Sport' },
  animals: { id: 'animals', label: 'Zwierzęta' },
  plants: { id: 'plants', label: 'Rośliny' },
  society: { id: 'society', label: 'Społeczeństwo' },
  economy: { id: 'economy', label: 'Ekonomia' },
  inventions: { id: 'inventions', label: 'Wynalazki' },
  earth: { id: 'earth', label: 'Ziemia' },
  human: { id: 'human', label: 'Człowiek' },
};

export const CATEGORY_LIST: CategoryMeta[] = Object.values(CATEGORIES);
