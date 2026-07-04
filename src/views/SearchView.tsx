import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Search, SearchX, SlidersHorizontal } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { CategoryChip } from '@/components/CategoryChip';
import { SearchResultItem } from '@/components/SearchResultItem';
import { EmptyState } from '@/components/EmptyState';
import { CATEGORY_LIST } from '@/data/categories';
import type { CategoryId } from '@/types/fact';
import { normalizeForComparison } from '@/utils/text';
import styles from './SearchView.module.css';

const PAGE_SIZE = 30;

export function SearchView() {
  const { filteredFacts, settings, updateSettings, isFavorite, toggleFavorite, recordView } =
    useAppState();
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useDocumentMeta(
    'Szukaj ciekawostek — Ciekawostki',
    'Przeszukuj i filtruj setki zweryfikowanych ciekawostek według kategorii i poziomu zaskoczenia.',
  );

  const normalizedQuery = normalizeForComparison(query);

  const results = useMemo(() => {
    if (!normalizedQuery) return filteredFacts;
    return filteredFacts.filter((fact) => {
      const haystack = normalizeForComparison(`${fact.title} ${fact.content}`);
      return haystack.includes(normalizedQuery);
    });
  }, [filteredFacts, normalizedQuery]);

  function handleQueryChange(value: string) {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
  }

  function toggleHiddenCategory(categoryId: CategoryId) {
    const hidden = settings.hiddenCategories;
    const next = hidden.includes(categoryId)
      ? hidden.filter((c) => c !== categoryId)
      : [...hidden, categoryId];
    updateSettings({ hiddenCategories: next });
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBar}>
        <Search size={19} aria-hidden="true" strokeWidth={2} />
        <label className="visually-hidden" htmlFor="search-input">
          Szukaj ciekawostek
        </label>
        <input
          id="search-input"
          type="search"
          className={styles.searchInput}
          placeholder="Szukaj ciekawostek…"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
        />
      </div>

      <button
        type="button"
        className={styles.filterToggle}
        aria-expanded={showFilters}
        aria-controls="filter-panel"
        onClick={() => setShowFilters((v) => !v)}
      >
        <SlidersHorizontal size={16} aria-hidden="true" strokeWidth={2} />
        Filtry
        {showFilters ? (
          <ChevronUp size={16} aria-hidden="true" strokeWidth={2} />
        ) : (
          <ChevronDown size={16} aria-hidden="true" strokeWidth={2} />
        )}
      </button>

      {showFilters && (
        <div id="filter-panel" className={styles.filterPanel}>
          <div className={styles.switchRow}>
            <label htmlFor="surprise-only">Tylko najbardziej zaskakujące (4–5)</label>
            <input
              id="surprise-only"
              type="checkbox"
              checked={settings.onlyMostSurprising}
              onChange={(e) => {
                updateSettings({ onlyMostSurprising: e.target.checked });
                setVisibleCount(PAGE_SIZE);
              }}
            />
          </div>

          <div>
            <p>Ukryj kategorie (nie będą losowane ani wyszukiwane):</p>
            <div className={styles.chipGrid}>
              {CATEGORY_LIST.map((meta) => {
                const hidden = settings.hiddenCategories.includes(meta.id);
                return (
                  <span key={meta.id} className={hidden ? styles.hiddenChip : undefined}>
                    <CategoryChip
                      category={meta.id}
                      selected={!hidden}
                      onClick={() => toggleHiddenCategory(meta.id)}
                    />
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <p className={styles.resultsMeta} aria-live="polite">
        Znaleziono {results.length} {results.length === 1 ? 'ciekawostkę' : 'ciekawostek'}
      </p>

      {results.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="Brak wyników"
          description="Spróbuj innej frazy lub zmień filtry kategorii."
        />
      ) : (
        <>
          <div className={styles.resultsList}>
            {results.slice(0, visibleCount).map((fact) => (
              <SearchResultItem
                key={fact.id}
                fact={fact}
                isFavorite={isFavorite(fact.id)}
                onToggleFavorite={() => toggleFavorite(fact.id)}
                onOpen={() => recordView(fact.id)}
              />
            ))}
          </div>
          {visibleCount < results.length && (
            <button
              type="button"
              className={styles.showMore}
              onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            >
              Pokaż więcej
            </button>
          )}
        </>
      )}
    </div>
  );
}
