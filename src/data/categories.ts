import type { CategoryId } from '@/types/fact';

export interface CategoryMeta {
  id: CategoryId;
  /** Etykieta wyświetlana w interfejsie (po polsku). */
  label: string;
  /** Emoji użyte jako lekka, dostępna ikona kategorii. */
  icon: string;
}

/**
 * Pojedyncze źródło prawdy o kategoriach. Dodanie nowej kategorii wymaga
 * wpisu tutaj oraz rozszerzenia unii `CategoryId` w `types/fact.ts` – to
 * jedyne dwa miejsca, które trzeba zmienić.
 */
export const CATEGORIES: Record<CategoryId, CategoryMeta> = {
  science: { id: 'science', label: 'Nauka', icon: '🔬' },
  space: { id: 'space', label: 'Kosmos', icon: '🚀' },
  history: { id: 'history', label: 'Historia', icon: '🏛️' },
  psychology: { id: 'psychology', label: 'Psychologia', icon: '🧠' },
  biology: { id: 'biology', label: 'Biologia', icon: '🧬' },
  medicine: { id: 'medicine', label: 'Medycyna', icon: '⚕️' },
  physics: { id: 'physics', label: 'Fizyka', icon: '⚛️' },
  chemistry: { id: 'chemistry', label: 'Chemia', icon: '🧪' },
  mathematics: { id: 'mathematics', label: 'Matematyka', icon: '📐' },
  geography: { id: 'geography', label: 'Geografia', icon: '🗺️' },
  technology: { id: 'technology', label: 'Technologia', icon: '⚙️' },
  computerScience: { id: 'computerScience', label: 'Informatyka', icon: '💻' },
  ai: { id: 'ai', label: 'Sztuczna inteligencja', icon: '🤖' },
  archaeology: { id: 'archaeology', label: 'Archeologia', icon: '🏺' },
  language: { id: 'language', label: 'Język', icon: '🗣️' },
  culture: { id: 'culture', label: 'Kultura', icon: '🎭' },
  art: { id: 'art', label: 'Sztuka', icon: '🎨' },
  music: { id: 'music', label: 'Muzyka', icon: '🎵' },
  sport: { id: 'sport', label: 'Sport', icon: '⚽' },
  animals: { id: 'animals', label: 'Zwierzęta', icon: '🐾' },
  plants: { id: 'plants', label: 'Rośliny', icon: '🌿' },
  society: { id: 'society', label: 'Społeczeństwo', icon: '👥' },
  economy: { id: 'economy', label: 'Ekonomia', icon: '💰' },
  inventions: { id: 'inventions', label: 'Wynalazki', icon: '💡' },
  earth: { id: 'earth', label: 'Ziemia', icon: '🌍' },
  human: { id: 'human', label: 'Człowiek', icon: '🫀' },
};

export const CATEGORY_LIST: CategoryMeta[] = Object.values(CATEGORIES);
