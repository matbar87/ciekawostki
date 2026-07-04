import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import styles from './InstallPrompt.module.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'ciekawostki:install-dismissed';

/** Baner instalacji PWA – nasłuchuje `beforeinstallprompt` i pozwala zainstalować aplikację jednym kliknięciem. */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1');

  useEffect(() => {
    function handler(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  }

  return (
    <div className={styles.banner} role="region" aria-label="Instalacja aplikacji">
      <p className={styles.text}>Zainstaluj Ciekawostki, aby mieć szybki dostęp offline.</p>
      <div className={styles.actions}>
        <button type="button" className={styles.install} onClick={handleInstall}>
          <Download size={16} aria-hidden="true" strokeWidth={2.25} />
          Zainstaluj
        </button>
        <button type="button" className={styles.dismiss} onClick={handleDismiss} aria-label="Zamknij baner instalacji">
          <X size={18} aria-hidden="true" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
