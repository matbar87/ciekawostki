import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppStateProvider } from '@/hooks/useAppState';
import { Layout } from '@/components/Layout';
import { HomeView } from '@/views/HomeView';
import { SearchView } from '@/views/SearchView';
import { FavoritesView } from '@/views/FavoritesView';
import { HistoryView } from '@/views/HistoryView';
import { FactOfDayView } from '@/views/FactOfDayView';

/**
 * `HashRouter` celowo zamiast `BrowserRouter`: aplikacja jest w 100%
 * statyczna (brak backendu) i ma działać po prostym `npm run build` na
 * dowolnym hostingu statycznym (a nawet z dysku lokalnego), bez konieczności
 * konfigurowania przekierowań serwera dla głębokich linków.
 */
export default function App() {
  return (
    <AppStateProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomeView />} />
            <Route path="/szukaj" element={<SearchView />} />
            <Route path="/ulubione" element={<FavoritesView />} />
            <Route path="/historia" element={<HistoryView />} />
            <Route path="/dzien" element={<FactOfDayView />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppStateProvider>
  );
}
