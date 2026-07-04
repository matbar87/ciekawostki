import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import '@/styles/global.css';
import '@/styles/animations.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Nie znaleziono elementu #root w index.html.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
    {/* Vercel Web Analytics: bezciasteczkowa, zagregowana analityka odwiedzin
        (patrz Polityka prywatności). Poza środowiskiem produkcyjnym Vercela
        skrypt działa w trybie "debug" i nic nie wysyła. */}
    <Analytics />
  </StrictMode>,
);
