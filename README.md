# Ciekawostki

Progresywna aplikacja webowa (PWA), która pokazuje jedną losową, zweryfikowaną
ciekawostkę na raz. Działa w 100% lokalnie w przeglądarce — bez backendu,
bez konta, w pełni offline po pierwszym uruchomieniu.

## Szybki start

```bash
npm install
npm run dev       # serwer deweloperski
npm run build     # build produkcyjny do ./dist
npm run preview   # podgląd builda produkcyjnego
```

Brak dodatkowej konfiguracji — działa od razu po `npm install`.

## Funkcje

- Losowa ciekawostka bez powtórzeń, aż do wyczerpania całej bazy (potem talia
  tasowana jest od nowa).
- **Ciekawostka dnia** — deterministycznie wyliczana z bieżącej daty (ten sam
  wynik dla wszystkich użytkowników danego dnia, bez backendu).
- Rozwijana sekcja "Czytaj dalej" z krótkim wyjaśnieniem i linkiem do źródła.
- Kopiowanie do schowka i udostępnianie przez Web Share API (z fallbackiem
  do kopiowania, gdy API nie jest dostępne).
- Ulubione, historia ostatnich 20 ciekawostek, licznik odkrytych ciekawostek.
- Wyszukiwarka pełnotekstowa + filtrowanie/ukrywanie kategorii + tryb
  "tylko najbardziej zaskakujące" (poziom 4–5).
- Jasny/ciemny/systemowy motyw, w pełni responsywny layout (telefon, tablet,
  desktop), nawigacja i etykiety dostępne z klawiatury i dla czytników ekranu.
- Pełne działanie offline (service worker) i instalacja jako aplikacja PWA
  (manifest + `beforeinstallprompt`).

## Stos technologiczny

React 18 + TypeScript + Vite, `react-router-dom` (`HashRouter`), IndexedDB
(przez lekką bibliotekę `idb`), `vite-plugin-pwa` (Workbox) do service
workera i manifestu. Brak backendu — wszystkie dane są statycznymi plikami
JSON dołączanymi do bundla podczas builda.

## Struktura projektu

```
src/
  components/   komponenty UI wielokrotnego użytku (FactCard, TopAppBar, ...)
  views/        widoki/strony podpięte pod routing (Home, Search, ...)
  hooks/        logika stanu aplikacji (useRandomFact, useFavorites, ...)
  services/     integracje z IndexedDB, losowanie, udostępnianie, dane
  data/         katalog kategorii + wygenerowana baza ciekawostek (facts/)
  types/        współdzielone typy TypeScript (Fact, UserSettings, ...)
  styles/       tokeny motywu, style globalne, animacje
  utils/        czyste funkcje pomocnicze (hash, formatowanie, losowość)
scripts/
  facts-source/          "surowe" partie ciekawostek pogrupowane wg kategorii
  generate-facts.mjs     waliduje, dedukuje i scala partie w jedną bazę JSON
  generate-icons.mjs     generuje ikony PWA (192/512, w tym maskowalne)
```

## Architektura bazy ciekawostek — jak dodać kolejne 500, 5000, 10000...

Baza nie jest "zaszyta" w kodzie. Działa to w dwóch warstwach:

1. **Źródła** (`scripts/facts-source/*.json`) — dowolna liczba plików,
   swobodnie pogrupowanych (np. wg kategorii). To tu dopisuje się nowe
   ciekawostki. Każdy rekord ma pola: `id`, `title`, `content`, `category`,
   `explanation`, `surpriseLevel` (1–5), `source`, `sourceUrl`.
2. **Generator** (`npm run facts:build`, czyli `scripts/generate-facts.mjs`)
   wczytuje wszystkie pliki źródłowe, **waliduje kompletność pól** i długość
   treści (100–220 znaków), **dedukuje duplikaty** (po `id` oraz po
   znormalizowanej treści — łapie też przeredagowane powtórzenia), automatycznie
   dolicza `readingTimeSeconds` i zapisuje jeden plik wynikowy:
   `src/data/facts/generated.facts.json`.

Aplikacja wczytuje dane przez `import.meta.glob('./*.facts.json')`
(`src/data/facts/index.ts`) — **każdy plik `*.facts.json` w tym katalogu jest
automatycznie włączany do aplikacji bez zmiany jednej linijki kodu**. Dzięki
temu baza może swobodnie urosnąć z ~500 do 5 000, 10 000 czy więcej rekordów:
wystarczy dopisać kolejne partie w `scripts/facts-source/` i uruchomić
`npm run facts:build`. Losowanie, wyszukiwanie i filtrowanie działają w
pamięci na tablicy obiektów, więc skalują się bez zmian logiki aż do
rozmiarów, przy których warto by rozważyć indeksowanie pełnotekstowe — co
przy kilkudziesięciu tysiącach rekordów wciąż nie jest konieczne.

## Kluczowe decyzje projektowe

- **IndexedDB zamiast localStorage** — ulubione, historia i stan losowania
  to dane strukturalne, które mogą urosnąć; IndexedDB jest do tego
  natywnie przystosowane i asynchroniczne (nie blokuje głównego wątku).
- **`HashRouter` zamiast `BrowserRouter`** — aplikacja jest w pełni statyczna
  (wymóg "brak backendu"), więc routing oparty o `#/` działa poprawnie na
  dowolnym hostingu statycznym i przy otwarciu z dysku lokalnego, bez
  konieczności konfigurowania przekierowań serwera dla głębokich linków.
- **Losowanie typu "shuffle bag"** — zamiast czystego `Math.random()` przy
  każdym losowaniu (co szybko prowadzi do powtórzeń), utrzymywana jest
  potasowana kolejka nieobejrzanych jeszcze ciekawostek, persystowana w
  IndexedDB. Gwarantuje to obejrzenie całej bazy przed powtórką i przetrwa
  odświeżenie strony.
- **"Ciekawostka dnia" jako czysta funkcja daty** — `hash(YYYY-MM-DD) % N`
  daje ten sam wynik każdemu użytkownikowi tego samego dnia bez potrzeby
  serwera czy synchronizacji.
- **`<details>` w wynikach wyszukiwania** zamiast własnego komponentu
  akordeonu — natywna dostępność klawiaturowa i dla czytników ekranu bez
  dodatkowego kodu JS.
- **Generator danych jako osobny krok build-time**, a nie runtime — dzięki
  temu produkcyjny bundle nie zawiera logiki walidacji/dedupikacji, a cała
  baza jest już "czysta" w momencie, gdy trafia do aplikacji.

## Dostępność

Nawigacja i wszystkie akcje są dostępne z klawiatury, ikony mają etykiety
`aria-label`, stan (ulubione, rozwinięcie, ładowanie) jest sygnalizowany
atrybutami ARIA (`aria-pressed`, `aria-expanded`, `aria-live`), kolory
motywu jasnego i ciemnego dobrano pod kątem kontrastu WCAG AA, a animacje
respektują `prefers-reduced-motion`.
