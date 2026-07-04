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

/**
 * Karta ciekawostki, którą można przeciągnąć w lewo (jak w aplikacjach typu
 * Tinder), by wylosować kolejną — dokładnie ten sam efekt co przycisk
 * "Wylosuj kolejną". Poprzednia ciekawostka zawsze znika w lewo, a kolejna
 * zawsze wjeżdża z prawej, niezależnie od tego, co wywołało zmianę.
 */
export const SwipeableFactCard = forwardRef<SwipeableFactCardHandle, SwipeableFactCardProps>(
  function SwipeableFactCard({ fact, isFavorite, onToggleFavorite, onExitComplete }, ref) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isExiting, setIsExiting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const drag = useRef({ startX: 0, active: false, pointerId: -1 });

    function triggerExit() {
      if (isExiting) return;
      setIsDragging(false);
      const el = wrapperRef.current;
      if (el) {
        el.style.transform = '';
        el.style.opacity = '';
      }
      setIsExiting(true);
    }

    useImperativeHandle(ref, () => ({ requestExit: triggerExit }));

    function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
      if (isExiting) return;
      // Nie przechwytuj gestu, jeśli użytkownik dotknął przycisku/linku w karcie.
      if ((e.target as HTMLElement).closest('button, a')) return;
      drag.current = { startX: e.clientX, active: true, pointerId: e.pointerId };
      setIsDragging(true);
      wrapperRef.current?.setPointerCapture(e.pointerId);
    }

    function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.startX;
      const el = wrapperRef.current;
      if (!el) return;
      // W lewo przeciąga się swobodnie, w prawo tylko z lekkim oporem (bez akcji).
      const translated = dx < 0 ? dx : dx * 0.15;
      el.style.transform = `translateX(${translated}px) rotate(${translated / 28}deg)`;
      el.style.opacity = String(Math.max(1 - Math.abs(translated) / 350, 0.35));
    }

    function handlePointerUp(e: ReactPointerEvent<HTMLDivElement>) {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.startX;
      drag.current.active = false;
      setIsDragging(false);
      if (dx < -SWIPE_THRESHOLD_PX) {
        triggerExit();
      } else {
        const el = wrapperRef.current;
        if (el) {
          el.style.transform = '';
          el.style.opacity = '';
        }
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
