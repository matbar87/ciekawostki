import { useEffect } from 'react';

interface DocumentMetaOptions {
  /** Ustawia meta robots=noindex — dla stron personalnych (ulubione, historia), które nie mają wartości dla wyszukiwarek. */
  noindex?: boolean;
}

function upsertRobotsTag(content: string | null) {
  let tag = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (!content) {
    tag?.remove();
    return;
  }
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', 'robots');
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/**
 * Aktualizuje <title>, meta description i (opcjonalnie) meta robots przy
 * zmianie widoku po stronie klienta. Statyczne, wstępnie wyrenderowane
 * strony (patrz `scripts/prerender.mjs`) mają już poprawne wartości w
 * znaczniku HTML dostarczanym przez serwer — ten hook dba o to, żeby
 * pozostały poprawne także po nawigacji wewnątrz aplikacji (SPA), bez
 * przeładowania strony.
 */
export function useDocumentMeta(title: string, description?: string, options?: DocumentMetaOptions) {
  useEffect(() => {
    document.title = title;
    if (description) {
      const tag = document.querySelector('meta[name="description"]');
      tag?.setAttribute('content', description);
    }
    upsertRobotsTag(options?.noindex ? 'noindex, follow' : null);
  }, [title, description, options?.noindex]);
}
