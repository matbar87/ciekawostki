import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import styles from './LegalView.module.css';

const LAST_UPDATED = '4 lipca 2026';
const CONTACT_EMAIL = 'mateusz@barniak.net';

/**
 * Polityka prywatności — szablon dostosowany do specyfiki aplikacji: brak
 * kont/formularzy, dane funkcjonalne trzymane lokalnie w przeglądarce oraz
 * bezciasteczkowa analityka Vercel Web Analytics. To punkt wyjścia, nie
 * gotowa opinia prawna — przed publikacją warto zweryfikować z prawnikiem,
 * a także okresowo sprawdzać aktualną dokumentację prywatności Vercela,
 * bo szczegóły przetwarzania po stronie dostawcy mogą się zmieniać.
 */
export function PrivacyPolicyView() {
  useDocumentMeta(
    'Polityka prywatności — Ciekawostki',
    'Polityka prywatności aplikacji Ciekawostki — jakie dane są przetwarzane, w tym Vercel Web Analytics, i jakie masz prawa.',
  );

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Polityka prywatności</h1>
      <p className={styles.updated}>Ostatnia aktualizacja: {LAST_UPDATED}</p>

      <h2>1. Administrator danych</h2>
      <p>
        Administratorem danych w rozumieniu RODO jest Mateusz Barniak, kontakt e-mail:{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>2. Aplikacja nie wymaga rejestracji</h2>
      <p>
        Korzystanie z aplikacji „Ciekawostki” nie wymaga założenia konta ani podania jakichkolwiek
        danych osobowych (imienia, adresu e-mail itp.). Poniżej opisujemy dane, które mimo to są
        przetwarzane w związku z działaniem aplikacji i jej hostingiem.
      </p>

      <h2>3. Dane przechowywane lokalnie w Twojej przeglądarce</h2>
      <p>
        Aby zapewnić podstawowe funkcje (ulubione ciekawostki, historia wyświetleń, ustawienia
        motywu i filtrów, tryb offline), aplikacja zapisuje dane wyłącznie lokalnie na Twoim
        urządzeniu, przy użyciu mechanizmów przeglądarki:
      </p>
      <ul>
        <li>
          <strong>IndexedDB</strong> — ulubione ciekawostki, historia ostatnio wyświetlonych
          ciekawostek, ustawienia (motyw, ukryte kategorie), stan losowania.
        </li>
        <li>
          <strong>localStorage</strong> — zapamiętany wybór motywu (jasny/ciemny/systemowy) oraz
          informacja o zamknięciu baneru instalacji.
        </li>
        <li>
          <strong>Cache Service Workera</strong> — pliki aplikacji i dane ciekawostek zapisane w
          celu umożliwienia działania offline.
        </li>
      </ul>
      <p>
        Te dane <strong>nigdy nie są wysyłane do administratora ani do jakiegokolwiek serwera</strong> —
        pozostają wyłącznie na Twoim urządzeniu i możesz je w każdej chwili usunąć, czyszcząc dane
        strony w ustawieniach przeglądarki lub odinstalowując aplikację. Ze względu na to, że
        służą wyłącznie realizacji funkcji, o które sam prosisz (zapamiętanie ulubionych, tryb
        offline), ich zapis nie wymaga odrębnej zgody w rozumieniu art. 173 Prawa
        telekomunikacyjnego.
      </p>

      <h2>4. Vercel Web Analytics</h2>
      <p>
        Aplikacja korzysta z usługi Vercel Web Analytics (dostawca: Vercel Inc.) do zbierania
        zagregowanych statystyk odwiedzin (np. liczba odwiedzin poszczególnych stron, kraj,
        typ urządzenia/przeglądarki, adres odsyłający). Zgodnie z dokumentacją dostawcy:
      </p>
      <ul>
        <li>usługa nie wykorzystuje plików cookie ani podobnych identyfikatorów trwałych,</li>
        <li>
          odwiedzający jest identyfikowany wyłącznie za pomocą jednorazowego skrótu (hash)
          wygenerowanego z przychodzącego żądania, a nie bezpośrednio adresu IP,
        </li>
        <li>dane sesji są automatycznie usuwane po 24 godzinach,</li>
        <li>
          dane wykorzystywane są w formie zagregowanej i nie służą do budowania profilu
          konkretnego użytkownika ani śledzenia go między stronami.
        </li>
      </ul>
      <p>
        Dane te mogą być przetwarzane na serwerach Vercel Inc. poza Europejskim Obszarem
        Gospodarczym (USA). Przekazywanie danych odbywa się w oparciu o mechanizmy zgodności
        stosowane przez dostawcę (więcej informacji:{' '}
        <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noreferrer noopener">
          dokumentacja Vercel Web Analytics
        </a>{' '}
        oraz{' '}
        <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer noopener">
          polityka prywatności Vercel
        </a>
        ).
      </p>

      <h2>5. Dane techniczne zbierane przez hosting</h2>
      <p>
        Jak każda usługa internetowa, aplikacja hostowana jest na infrastrukturze dostawcy
        (Vercel Inc.), który w ramach standardowego działania serwerów może przetwarzać
        podstawowe dane techniczne żądań (np. adres IP, znacznik czasu, nagłówki żądania) w celu
        zapewnienia bezpieczeństwa i prawidłowego działania usługi hostingowej.
      </p>

      <h2>6. Cele i podstawy prawne przetwarzania</h2>
      <ul>
        <li>świadczenie usługi zgodnie z żądaniem użytkownika — art. 6 ust. 1 lit. b RODO,</li>
        <li>
          analiza statystyczna ruchu i poprawa jakości aplikacji oraz zapewnienie bezpieczeństwa —
          prawnie uzasadniony interes administratora i dostawcy hostingu — art. 6 ust. 1 lit. f
          RODO.
        </li>
      </ul>

      <h2>7. Twoje prawa</h2>
      <p>
        W zakresie, w jakim przetwarzane są dane, które mogłyby zostać powiązane z Twoją osobą,
        przysługuje Ci prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia
        przetwarzania, przenoszenia danych oraz wniesienia sprzeciwu, a także prawo wniesienia
        skargi do Prezesa Urzędu Ochrony Danych Osobowych. W sprawach dotyczących danych
        opisanych w punkcie 3 (dane lokalne w przeglądarce) możesz samodzielnie i w każdej chwili
        usunąć je, czyszcząc dane strony w przeglądarce.
      </p>

      <h2>8. Bezpieczeństwo</h2>
      <p>
        Aplikacja jest serwowana wyłącznie przez połączenie szyfrowane (HTTPS). Ze względu na
        brak backendu przetwarzającego dane osobowe, ryzyko związane z ich przechowywaniem po
        stronie administratora jest znacząco ograniczone.
      </p>

      <h2>9. Zmiany polityki prywatności</h2>
      <p>
        Niniejsza polityka może być okresowo aktualizowana, w szczególności w związku ze zmianą
        funkcjonalności aplikacji, wykorzystywanych usług lub przepisów prawa. Aktualna wersja
        wraz z datą ostatniej aktualizacji jest zawsze dostępna pod niniejszym adresem.
      </p>

      <h2>10. Kontakt</h2>
      <p>
        W sprawach dotyczących ochrony danych osobowych skontaktuj się pod adresem:{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <p className={styles.notice}>
        Niniejsza polityka prywatności ma charakter ogólnego szablonu. Nie stanowi porady prawnej
        — przed publikacją produkcyjną warto zweryfikować jej treść z prawnikiem oraz sprawdzić
        aktualną dokumentację prywatności dostawcy hostingu i analityki (Vercel Inc.).
      </p>
    </div>
  );
}
