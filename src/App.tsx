import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppStateProvider } from '@/hooks/useAppState';
import { Layout } from '@/components/Layout';
import { HomeView } from '@/views/HomeView';
import { SearchView } from '@/views/SearchView';
import { FavoritesView } from '@/views/FavoritesView';
import { HistoryView } from '@/views/HistoryView';
import { FactOfDayView } from '@/views/FactOfDayView';
import { FactDetailView } from '@/views/FactDetailView';
import { NotFoundView } from '@/views/NotFoundView';
import { RegulaminView } from '@/views/RegulaminView';
import { PrivacyPolicyView } from '@/views/PrivacyPolicyView';

/**
 * `BrowserRouter` (zamiast `HashRouter`): każda ciekawostka ma własny,
 * czysty adres URL (`/ciekawostka/:id`), który wyszukiwarki mogą
 * zaindeksować niezależnie od reszty aplikacji. Wymaga to na hostingu
 * przekierowania nieznanych ścieżek do `index.html` (patrz `vercel.json`),
 * ale dla stron ciekawostek i tak generujemy prawdziwe, statyczne pliki
 * HTML w kroku `scripts/prerender.mjs`, więc to przekierowanie jest
 * jedynie zabezpieczeniem dla pozostałych, niewyeksportowanych tras.
 */
export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomeView />} />
            <Route path="/szukaj" element={<SearchView />} />
            <Route path="/ulubione" element={<FavoritesView />} />
            <Route path="/historia" element={<HistoryView />} />
            <Route path="/dzien" element={<FactOfDayView />} />
            <Route path="/ciekawostka/:id" element={<FactDetailView />} />
            <Route path="/regulamin" element={<RegulaminView />} />
            <Route path="/polityka-prywatnosci" element={<PrivacyPolicyView />} />
            <Route path="*" element={<NotFoundView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  );
}
