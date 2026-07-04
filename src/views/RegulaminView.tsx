import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import styles from './LegalView.module.css';

const LAST_UPDATED = '4 lipca 2026';
const CONTACT_EMAIL = 'mateusz@barniak.net';

/**
 * Regulamin świadczenia usługi drogą elektroniczną, wymagany przez art. 8
 * ustawy z dnia 18 lipca 2002 r. o świadczeniu usług drogą elektroniczną.
 * To szablon — przed publikacją produkcyjną warto skonsultować treść
 * z prawnikiem, zwłaszcza w zakresie formy prowadzonej działalności.
 */
export function RegulaminView() {
  useDocumentMeta(
    'Regulamin — Ciekawostki',
    'Regulamin korzystania z aplikacji Ciekawostki — zasady świadczenia usługi, warunki techniczne i reklamacje.',
  );

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Regulamin aplikacji „Ciekawostki”</h1>
      <p className={styles.updated}>Ostatnia aktualizacja: {LAST_UPDATED}</p>

      <h2>1. Postanowienia ogólne</h2>
      <p>
        Niniejszy regulamin („Regulamin”) określa zasady korzystania z aplikacji internetowej
        „Ciekawostki” („Aplikacja”), dostępnej pod adresem, pod którym Aplikacja jest publikowana.
        Usługodawcą i administratorem danych jest Mateusz Barniak, kontakt:{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> („Usługodawca”).
      </p>
      <p>
        Korzystanie z Aplikacji oznacza akceptację niniejszego Regulaminu. Jeśli nie akceptujesz
        Regulaminu, prosimy o niekorzystanie z Aplikacji.
      </p>

      <h2>2. Rodzaj i zakres usługi</h2>
      <p>
        Aplikacja jest bezpłatną usługą świadczoną drogą elektroniczną, niewymagającą rejestracji
        ani podawania danych osobowych. Umożliwia ona przeglądanie losowych, zweryfikowanych
        ciekawostek z różnych dziedzin wiedzy, ich wyszukiwanie, filtrowanie, oznaczanie jako
        ulubione oraz przeglądanie historii wyświetleń — lokalnie, w przeglądarce użytkownika.
      </p>
      <p>
        Aplikacja działa w całości po stronie klienta (bez serwera przetwarzającego treści
        użytkownika) i może być zainstalowana jako Progresywna Aplikacja Webowa (PWA) oraz
        używana offline po pierwszym wczytaniu.
      </p>

      <h2>3. Warunki techniczne</h2>
      <p>
        Do korzystania z Aplikacji niezbędne jest urządzenie z dostępem do internetu (przy
        pierwszym uruchomieniu) oraz przeglądarka internetowa obsługująca JavaScript, IndexedDB
        i Service Workery. Usługodawca nie gwarantuje poprawnego działania Aplikacji w
        przeglądarkach niespełniających tych wymagań lub istotnie przestarzałych.
      </p>

      <h2>4. Zasady korzystania</h2>
      <p>
        Zabronione jest podejmowanie działań mogących zakłócić prawidłowe funkcjonowanie
        Aplikacji (np. nadmierne obciążanie infrastruktury, próby nieautoryzowanego dostępu) oraz
        wykorzystywanie Aplikacji w sposób sprzeczny z prawem lub dobrymi obyczajami.
      </p>

      <h2>5. Treści prezentowane w Aplikacji</h2>
      <p>
        Ciekawostki prezentowane w Aplikacji mają charakter edukacyjno-rozrywkowy. Redakcja
        dokłada starań, aby prezentowane fakty były zgodne z aktualnym stanem wiedzy i opierały
        się na wiarygodnych źródłach (wskazanych przy każdej ciekawostce), jednak Usługodawca nie
        gwarantuje ich absolutnej kompletności ani bezbłędności i nie ponosi odpowiedzialności za
        decyzje podjęte na ich podstawie. Treści nie stanowią porady medycznej, prawnej, finansowej
        ani innej porady profesjonalnej.
      </p>
      <p>
        Treści redakcyjne (tytuły, opisy, wyjaśnienia) stanowią własne opracowanie Usługodawcy.
        Nazwy i znaki towarowe wskazanych źródeł (np. NASA, WHO, Britannica) należą do ich
        właścicieli i są przywoływane wyłącznie w celach informacyjnych/cytowania źródła.
      </p>

      <h2>6. Własność intelektualna</h2>
      <p>
        Kod, szata graficzna i struktura Aplikacji podlegają ochronie prawnoautorskiej. Korzystanie
        z Aplikacji nie oznacza przeniesienia jakichkolwiek praw własności intelektualnej na
        użytkownika.
      </p>

      <h2>7. Dane osobowe i dane lokalne</h2>
      <p>
        Zasady przetwarzania danych opisuje odrębny dokument:{' '}
        <a href="/polityka-prywatnosci">Polityka prywatności</a>.
      </p>

      <h2>8. Reklamacje</h2>
      <p>
        Reklamacje dotyczące działania Aplikacji można zgłaszać na adres e-mail{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, podając opis problemu oraz dane
        umożliwiające kontakt zwrotny. Usługodawca rozpatrzy reklamację w terminie 14 dni od jej
        otrzymania.
      </p>

      <h2>9. Zmiany Regulaminu</h2>
      <p>
        Usługodawca zastrzega sobie prawo do zmiany Regulaminu, w szczególności w przypadku zmian
        w funkcjonalności Aplikacji lub obowiązujących przepisów prawa. Aktualna wersja Regulaminu
        jest zawsze dostępna pod niniejszym adresem, wraz z datą ostatniej aktualizacji.
      </p>

      <h2>10. Postanowienia końcowe</h2>
      <p>
        W sprawach nieuregulowanych Regulaminem zastosowanie mają przepisy prawa polskiego, w tym
        ustawy z dnia 18 lipca 2002 r. o świadczeniu usług drogą elektroniczną oraz Kodeksu
        cywilnego. Ewentualne spory będą rozstrzygane przez sąd właściwy zgodnie z obowiązującymi
        przepisami, z zastrzeżeniem szczególnych uprawnień przysługujących konsumentom.
      </p>
    </div>
  );
}
