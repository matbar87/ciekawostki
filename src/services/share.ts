import type { Fact } from '@/types/fact';
import { factPath } from '@/utils/routes';

/** Stała strona ciekawostki w tej aplikacji (do udostępniania/kopiowania). */
function appFactUrl(fact: Fact): string {
  return `${window.location.origin}${factPath(fact.id)}`;
}

function formatFactText(fact: Fact): string {
  const appUrl = appFactUrl(fact);
  return `${fact.title}\n\n${fact.content}\n\nŹródło: ${fact.source} (${fact.sourceUrl})\n\nOdkryte w aplikacji: ${appUrl}`;
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
      url: appFactUrl(fact),
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
