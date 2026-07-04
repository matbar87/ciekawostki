import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TransitionEvent as ReactTransitionEvent,
} from 'react';
import type { Fact } from '@/types/fact';
import { FactCard } from './FactCard';
import styles from './SwipeableFactCard.module.css';

export interface SwipeableFactCardHandle {
  /** Uruchamia tę samą animację wyjścia, co potwierdzone przeciągnięcie w lewo. */
  requestExit: () => void;
}

interface SwipeableFactCardProps {
  fact: Fact;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  /**
   * Wywoływane dokładnie w momencie, gdy karta zniknęła z ekranu (po swipe'ie
   * w lewo albo po `requestExit()`) — tu rodzic powinien wylosować kolejną
   * ciekawostkę. Nowa karta automatycznie wjedzie z prawej strony.
   */
  onExitComplete: () => void;
}

const SWIPE_THRESHOLD_PX = 90;
/** Ile pikseli ruchu, zanim w ogóle rozstrzygniemy, czy to gest poziomy czy pionowy. */
const DIRECTION_LOCK_PX = 8;

type DragAxis = null | 'horizontal' | 'vertical';

interface DragState {
  startX: number;
  startY: number;
  pointerId: number;
  active: boolean;
  axis: DragAxis;
}

/**
 * Karta ciekawostki, którą można przeciągnąć w lewo (jak w aplikacjach typu
 * Tinder), by wylosować kolejną — dokładnie ten sam efekt co przycisk
 * "Wylosuj kolejną". Poprzednia ciekawostka zawsze znika w lewo, a kolejna
 * zawsze wjeżdża z prawej, niezależnie od tego, co wywołało zmianę.
 *
 * Kierunek gestu rozpoznajemy dopiero po kilku pikselach ruchu: dopóki nie
 * wiadomo, czy to przeciąganie poziome czy zwykłe przewijanie strony w pionie,
 * nic nie robimy i nie przechwytujemy wskaźnika — dzięki temu normalne
 * przewijanie w górę/w dół nigdy nie jest przez tę kartę zakłócane.
 */
export const SwipeableFactCard = forwardRef<SwipeableFactCardHandle, SwipeableFactCardProps>(
  function SwipeableFactCard({ fact, isFavorite, onToggleFavorite, onExitComplete }, ref) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isExiting, setIsExiting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const drag = useRef<DragState>({ startX: 0, startY: 0, pointerId: -1, active: false, axis: null });

    function resetInlineStyle() {
      const el = wrapperRef.current;
      if (el) {
        el.style.transform = '';
        el.style.opacity = '';
      }
    }

    function triggerExit() {
      if (isExiting) return;
      setIsDragging(false);
      resetInlineStyle();
      setIsExiting(true);
    }

    useImperativeHandle(ref, () => ({ requestExit: triggerExit }));

    function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
      if (isExiting) return;
      // Nie przechwytuj gestu, jeśli użytkownik dotknął przycisku/linku w karcie.
      if ((e.target as HTMLElement).closest('button, a')) return;
      drag.current = { startX: e.clientX, startY: e.clientY, pointerId: e.pointerId, active: true, axis: null };
      // Celowo NIE wołamy tu setPointerCapture — zrobimy to dopiero, gdy
      // rozpoznamy, że gest jest poziomy. Inaczej przechwycenie wskaźnika
      // od razu blokowałoby przeglądarce naturalne przewijanie w pionie.
    }

    function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
      const state = drag.current;
      if (!state.active) return;
      const dx = e.clientX - state.startX;
      const dy = e.clientY - state.startY;

      if (state.axis === null) {
        if (Math.abs(dx) < DIRECTION_LOCK_PX && Math.abs(dy) < DIRECTION_LOCK_PX) return;
        if (Math.abs(dy) >= Math.abs(dx)) {
          // Pionowe przewijanie strony — oddajemy pełną kontrolę przeglądarce
          // i już nigdy nie ruszamy karty w trakcie tego gestu.
          state.axis = 'vertical';
          state.active = false;
          return;
        }
        state.axis = 'horizontal';
        setIsDragging(true);
        try {
          wrapperRef.current?.setPointerCapture(state.pointerId);
        } catch {
          // Nieaktywny/nieistniejący wskaźnik — bezpiecznie ignorujemy, przeciąganie
          // i tak działa poprawnie dzięki nasłuchiwaniu na tym samym elemencie.
        }
      }

      if (state.axis !== 'horizontal') return;
      const el = wrapperRef.current;
      if (!el) return;
      // W lewo przeciąga się swobodnie, w prawo tylko z lekkim oporem (bez akcji).
      const translated = dx < 0 ? dx : dx * 0.15;
      el.style.transform = `translateX(${translated}px) rotate(${translated / 28}deg)`;
      el.style.opacity = String(Math.max(1 - Math.abs(translated) / 350, 0.35));
    }

    function handlePointerUp(e: ReactPointerEvent<HTMLDivElement>) {
      const state = drag.current;
      if (!state.active || state.axis !== 'horizontal') {
        state.active = false;
        return;
      }
      const dx = e.clientX - state.startX;
      state.active = false;
      setIsDragging(false);
      if (dx < -SWIPE_THRESHOLD_PX) {
        triggerExit();
      } else {
        resetInlineStyle();
      }
    }

    function handleTransitionEnd(e: ReactTransitionEvent<HTMLDivElement>) {
      // Nasłuchujemy na "opacity", bo ta właściwość zawsze się zmienia (także
      // przy włączonym `prefers-reduced-motion`, gdzie transform zostaje wyłączony).
      if (e.propertyName !== 'opacity' || !isExiting) return;
      setIsExiting(false);
      onExitComplete();
    }

    const wrapperClassName = [
      styles.wrapper,
      isExiting ? styles.exiting : '',
      isDragging ? styles.dragging : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={wrapperRef}
        className={wrapperClassName}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTransitionEnd={handleTransitionEnd}
      >
        <div key={fact.id} className={styles.enterFromRight}>
          <FactCard fact={fact} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} headingLevel="h1" />
        </div>
      </div>
    );
  },
);
