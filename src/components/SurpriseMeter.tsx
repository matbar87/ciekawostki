import type { SurpriseLevel } from '@/types/fact';
import styles from './SurpriseMeter.module.css';

interface SurpriseMeterProps {
  level: SurpriseLevel;
}

/** Wizualny wskaźnik poziomu zaskoczenia (1–5) jako rząd wypełnionych kropek. */
export function SurpriseMeter({ level }: SurpriseMeterProps) {
  const label = `Poziom zaskoczenia: ${level} na 5`;
  return (
    <div className={styles.meter} role="img" aria-label={label} title={label}>
      {[1, 2, 3, 4, 5].map((dot) => (
        <span
          key={dot}
          aria-hidden="true"
          className={dot <= level ? styles.dotFilled : styles.dot}
        />
      ))}
    </div>
  );
}
