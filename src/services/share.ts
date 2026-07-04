import type { Fact } from '@/types/fact';

function formatFactText(fact: Fact): string {
  return `${fact.title}\n\n${fact.content}\n\nŹródło: ${fact.source} (${fact.sourceUrl})\n\nOdkryte w aplikacji Ciekawostki`;
}

/** Kopiuje ciekawostkę do schowka. Zwraca true przy sukcesie. */
export async function copyFactToClipboard(fact: Fact): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(formatFactText(fact));
    return true;
  } catch (error) {
    console.error('[share] Kopiowanie do schowka nie powiodło się:', error);
    return false;
  }
}

export function canShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/** Udostępnia ciekawostkę przez natywny Web Share API. Zwraca true przy sukcesie. */
export async function shareFact(fact: Fact): Promise<boolean> {
  if (!canShare()) return false;
  try {
    await navigator.share({
      title: fact.title,
      text: formatFactText(fact),
      url: fact.sourceUrl,
    });
    return true;
  } catch (error) {
    // AbortError oznacza, że użytkownik po prostu anulował – to nie błąd.
    if ((error as DOMException)?.name !== 'AbortError') {
      console.error('[share] Udostępnianie nie powiodło się:', error);
    }
    return false;
  }
}
