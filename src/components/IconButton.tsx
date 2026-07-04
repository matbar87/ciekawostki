import { forwardRef, type ButtonHTMLAttributes } from 'react';
import styles from './IconButton.module.css';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Wymagana etykieta dla czytników ekranu (przycisk nie ma widocznego tekstu). */
  label: string;
  active?: boolean;
}

/** Przycisk-ikona zgodny z wytycznymi dostępności: zawsze ma aria-label i widoczny fokus. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, active, className, children, ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={[styles.button, active ? styles.active : '', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </button>
  ),
);

IconButton.displayName = 'IconButton';
