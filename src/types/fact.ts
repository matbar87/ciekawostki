/**
 * Identyfikator kategorii ciekawostki. Trzymany jako unia literałów (a nie
 * dowolny string), żeby błąd w pliku danych wykrył sam kompilator TypeScript
 * zamiast ujawnić się dopiero w runtime.
 */
export type CategoryId =
  | 'science'
  | 'space'
  | 'history'
  | 'psychology'
  | 'biology'
  | 'medicine'
  | 'physics'
  | 'chemistry'
  | 'mathematics'
  | 'geography'
  | 'technology'
  | 'computerScience'
  | 'ai'
  | 'archaeology'
  | 'language'
  | 'culture'
  | 'art'
  | 'music'
  | 'sport'
  | 'animals'
  | 'plants'
  | 'society'
  | 'economy'
  | 'inventions'
  | 'earth'
  | 'human'
  | 'bible';

/** Poziom zaskoczenia ciekawostki – 1 (oczywiste) .. 5 (trudne do uwierzenia). */
export type SurpriseLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Pojedyncza ciekawostka. To jest jedyny kontrakt danych, na którym opiera
 * się cała aplikacja — dowolna liczba plików JSON w `src/data/facts` może
 * dostarczać rekordy zgodne z tym typem i zostaną one automatycznie
 * wykryte przez repozytorium danych (patrz `services/factsRepository.ts`).
 */
export interface Fact {
  /** Stabilny, unikalny identyfikator (np. "space-0007"). */
  id: string;
  /** Krótki, nie-clickbaitowy tytuł. */
  title: string;
  /** Treść ciekawostki – ok. 100–220 znaków, jedno zdanie-dwa. */
  content: string;
  /** Kategoria tematyczna. */
  category: CategoryId;
  /** Krótkie wyjaśnienie / kontekst, dlaczego to prawda. */
  explanation: string;
  /** Subiektywny poziom zaskoczenia 1–5, używany przez filtr "najbardziej zaskakujące". */
  surpriseLevel: SurpriseLevel;
  /** Szacowany czas czytania treści + wyjaśnienia, w sekundach. */
  readingTimeSeconds: number;
  /** Nazwa wiarygodnego źródła (np. "NASA", "WHO", "Britannica"). */
  source: string;
  /** Link do źródła. */
  sourceUrl: string;
}

/** Pola wymagane do walidacji rekordu wczytanego z pliku JSON. */
export const REQUIRED_FACT_FIELDS: (keyof Fact)[] = [
  'id',
  'title',
  'content',
  'category',
  'explanation',
  'surpriseLevel',
  'readingTimeSeconds',
  'source',
  'sourceUrl',
];
