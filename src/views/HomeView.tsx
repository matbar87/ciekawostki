import { useRef } from 'react';
import { EyeOff, Shuffle } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import { useRandomFact } from '@/hooks/useRandomFact';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { SwipeableFactCard, type SwipeableFactCardHandle } from '@/components/SwipeableFactCard';
import { EmptyState } from '@/components/EmptyState';
import styles from './HomeView.module.css';

/**
 * Ekran główny: jedna losowa ciekawostka i przycisk "Wylosuj kolejną".
 * To jedyny widok, jaki użytkownik widzi zaraz po uruchomieniu aplikacji –
 * celowo pozbawiony jakichkolwiek rozpraszaczy. Kartę można też przeciągnąć
 * w lewo (jak w aplikacjach typu Tinder), by wylosować kolejną ciekawostkę.
 */
export function HomeView() {
  const { isFavorite, toggleFavorite, filteredFacts } = useAppState();
  const { currentFact, isLoading, drawNext } = useRandomFact();
  const cardRef = useRef<SwipeableFactCardHandle>(null);

  useDocumentMeta(
    'Ciekawostki — losowe, zweryfikowane fakty ze świata nauki i nie tylko',
    'Codzienna dawka zaskakujących, zweryfikowanych ciekawostek z nauki, kosmosu, historii, psychologii i wielu innych dziedzin.',
  );

  if (filteredFacts.length === 0) {
    return (
      <EmptyState
        icon={EyeOff}
        title="Brak ciekawostek do pokazania"
        description="Wszystkie kategorie są obecnie ukryte. Zmień ustawienia filtrów, aby znów zobaczyć ciekawostki."
      />
    );
  }

  return (
    <div className={styles.wrapper}>
      {currentFact ? (
        <SwipeableFactCard
          ref={cardRef}
          fact={currentFact}
          isFavorite={isFavorite(currentFact.id)}
          onToggleFavorite={() => toggleFavorite(currentFact.id)}
          onExitComplete={() => {
            drawNext();
            // Nowa ciekawostka bywa krótsza niż poprzednia, więc strona może
            // się skurczyć w trakcie animowanego (smooth) scrolla wywołanego
            // niżej przy kliknięciu — przeglądarka potrafi wtedy przyciąć
            // scroll gdzieś w połowie zamiast dojechać do samej góry.
            // Ten natychmiastowy (nie animowany) skok gwarantuje, że nowa
            // karta zawsze wystartuje w pełni widoczna od samej góry.
            window.scrollTo(0, 0);
          }}
        />
      ) : (
        <div className={styles.skeleton} aria-hidden="true" />
      )}

      <button
        type="button"
        className={styles.drawButton}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          cardRef.current?.requestExit();
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className={styles.spinner} aria-hidden="true" />
        ) : (
          <Shuffle size={19} aria-hidden="true" strokeWidth={2.25} />
        )}
        Wylosuj kolejną
      </button>
    </div>
  );
}
