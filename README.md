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
- Jasny/ciemny/systemowy motyw (domyślnie zgodny z systemem, ustawiany jeszcze
  przed pierwszym malowaniem strony — bez błysku złego motywu), stały
  (fixed) górny pasek, w pełni responsywny layout (telefon, tablet, desktop),
  nawigacja i etykiety dostępne z klawiatury i dla czytników ekranu.
- Jednokolorowe ikony outline ([lucide-react](https://lucide.dev)) zamiast
  emoji — spójny, nowoczesny wygląd niezależny od czcionek systemowych.
- Pełne działanie offline (service worker) i instalacja jako aplikacja PWA
  (manifest + `beforeinstallprompt`).
- Każda ciekawostka ma własną, statycznie wygenerowaną, indeksowalną stronę
  pod czystym adresem `/ciekawostka/<id>` — patrz sekcja SEO poniżej.

## Stos technologiczny

React 18 + TypeScript + Vite, `react-router-dom` (`BrowserRouter`), IndexedDB
(przez lekką bibliotekę `idb`), `vite-plugin-pwa` (Workbox) do service
workera i manifestu, `lucide-react` do ikon. Brak backendu w czasie
działania — wszystkie dane są statycznymi plikami JSON dołączanymi do bundla
podczas builda, a strony poszczególnych ciekawostek są prerenderowane do
statycznego HTML tym samym krokiem builda (patrz `scripts/prerender.mjs`).

## Struktura projektu

```
src/
  components/   komponenty UI wielokrotnego użytku (FactCard, TopAppBar, ...)
  views/        widoki/strony podpięte pod routing (Home, Search, FactDetail, ...)
  hooks/        logika stanu aplikacji (useRandomFact, useFavorites, useDocumentMeta, ...)
  services/     integracje z IndexedDB, losowanie, udostępnianie, dane
  data/         katalog kategorii + wygenerowana baza ciekawostek (facts/)
  types/        współdzielone typy TypeScript (Fact, UserSettings, ...)
  styles/       tokeny motywu, style globalne, animacje
  utils/        czyste funkcje pomocnicze (hash, formatowanie, losowość, trasy)
scripts/
  facts-source/          "surowe" partie ciekawostek pogrupowane wg kategorii
  generate-facts.mjs     waliduje, dedukuje i scala partie w jedną bazę JSON
  generate-icons.mjs     generuje ikony PWA (192/512, w tym maskowalne)
  prerender.mjs          po `vite build`: generuje statyczną stronę HTML
                         dla każdej ciekawostki + sitemap.xml + robots.txt
vercel.json     konfiguracja builda i przekierowań dla wdrożenia na Vercel
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
- **`BrowserRouter` (nie `HashRouter`)** — każda ciekawostka ma czysty,
  indeksowalny adres `/ciekawostka/<id>`, kluczowy dla SEO. Wymaga to na
  hostingu przekierowania niestatycznych ścieżek do `index.html`
  (`vercel.json`), ale strony ciekawostek i tak istnieją jako prawdziwe
  pliki statyczne, więc to przekierowanie jest tylko zabezpieczeniem dla
  pozostałych tras (np. `/ulubione`).
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
- **Prerendering zamiast pełnego SSR** — zamiast uruchamiać serwer Node
  (React SSR) na każde żądanie, statyczne strony ciekawostek generujemy raz,
  w czasie builda. To rozwiązanie tańsze i prostsze niż SSR, w pełni zgodne
  z wymogiem "brak backendu", a dla ~500 (docelowo nawet kilku tysięcy)
  stron w zupełności wystarczające.
- **`base: '/'` (bezwzględna) w Vite** — konieczne, bo strony ciekawostek
  żyją pod zagnieżdżonymi ścieżkami (`/ciekawostka/<id>/`); przy względnej
  bazie odnośniki do JS/CSS liczyłyby się od głębokości aktualnego adresu
  i psuły się wszędzie poza stroną główną.

## SEO i strony ciekawostek

Aplikacja jest SPA renderowanym po stronie klienta, ale **każda ciekawostka
ma własny, prawdziwy plik HTML** generowany w kroku `npm run build` przez
`scripts/prerender.mjs` (uruchamiany automatycznie po `vite build`):

- **`dist/ciekawostka/<id>/index.html`** — osobna, statyczna strona dla
  każdej z ~500 ciekawostek, z unikalnym `<title>`, `<meta name="description">`,
  linkiem `canonical`, tagami Open Graph i Twitter Card, danymi
  strukturalnymi JSON-LD (`schema.org/Article`) oraz czytelną treścią
  (tytuł, treść, wyjaśnienie, źródło) wstrzykniętą bezpośrednio do znacznika
  `<div id="root">` — widoczną dla robotów wyszukiwarek i social-media
  jeszcze zanim wykona się JavaScript. Po stronie przeglądarki React i tak
  przejmuje ten element i renderuje w pełni interaktywną kartę.
- **`dist/sitemap.xml`** — lista wszystkich adresów wartych zaindeksowania
  (strona główna, wyszukiwarka, ciekawostka dnia, wszystkie ciekawostki).
- **`dist/robots.txt`** — odnośnik do sitemapy oraz `Disallow` dla stron
  personalnych (`/ulubione`, `/historia`), które zależą od lokalnych danych
  przeglądarki użytkownika i nie mają wartości w wynikach wyszukiwania
  (dodatkowo oznaczone `noindex` po stronie klienta).
- **`vercel.json`** — jeden przepis `rewrites` kierujący każdą ścieżkę bez
  pasującego pliku statycznego do `index.html` (SPA fallback). Prawdziwe
  pliki (strony ciekawostek, assety, `sitemap.xml`) mają pierwszeństwo przed
  tym przekierowaniem — Vercel domyślnie najpierw sprawdza system plików.

### Domena produkcyjna (`SITE_URL`)

Adresy `canonical`/Open Graph i `sitemap.xml` wymagają znajomości pełnej
domeny produkcyjnej. Skrypt czyta ją ze zmiennej środowiskowej `SITE_URL`
(fallback: `https://ciekawy.vercel.app`, jeśli zmienna nie jest
ustawiona). **Gdy już będziesz znać docelową domenę**, ustaw w Vercelu
(Project Settings → Environment Variables): `SITE_URL=https://twoja-domena.pl`
i zrób redeploy — wszystkie linki kanoniczne i sitemapa automatycznie
przeliczą się poprawnie przy kolejnym buildzie.

## Dostępność

Nawigacja i wszystkie akcje są dostępne z klawiatury, ikony mają etykiety
`aria-label`, stan (ulubione, rozwinięcie, ładowanie) jest sygnalizowany
atrybutami ARIA (`aria-pressed`, `aria-expanded`, `aria-live`), kolory
motywu jasnego i ciemnego dobrano pod kątem kontrastu WCAG AA, a animacje
respektują `prefers-reduced-motion`.
