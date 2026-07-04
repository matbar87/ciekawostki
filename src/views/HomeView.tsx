import { EyeOff, Shuffle } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import { useRandomFact } from '@/hooks/useRandomFact';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { FactCard } from '@/components/FactCard';
import { EmptyState } from '@/components/EmptyState';
import styles from './HomeView.module.css';

/**
 * Ekran główny: jedna losowa ciekawostka i przycisk "Wylosuj kolejną".
 * To jedyny widok, jaki użytkownik widzi zaraz po uruchomieniu aplikacji –
 * celowo pozbawiony jakichkolwiek rozpraszaczy.
 */
export function HomeView() {
  const { isFavorite, toggleFavorite, filteredFacts } = useAppState();
  const { currentFact, isLoading, drawNext } = useRandomFact();

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
        <FactCard
          fact={currentFact}
          isFavorite={isFavorite(currentFact.id)}
          onToggleFavorite={() => toggleFavorite(currentFact.id)}
          headingLevel="h1"
        />
      ) : (
        <div className={styles.skeleton} aria-hidden="true" />
      )}

      <button
        type="button"
        className={styles.drawButton}
        onClick={() => drawNext()}
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
