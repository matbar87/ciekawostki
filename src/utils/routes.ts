/**
 * Scentralizowane ścieżki tras aplikacji. Wzorzec dla ciekawostek
 * (`/ciekawostka/:id`) jest też odtwarzany w `scripts/prerender.mjs` przy
 * generowaniu statycznych stron — obie definicje muszą pozostać zgodne.
 */
export const ROUTES = {
  home: '/',
  search: '/szukaj',
  favorites: '/ulubione',
  history: '/historia',
  factOfDay: '/dzien',
  fact: '/ciekawostka/:id',
  terms: '/regulamin',
  privacy: '/polityka-prywatnosci',
} as const;

export function factPath(id: string): string {
  return `/ciekawostka/${id}`;
}
