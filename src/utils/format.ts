/** Formatuje szacowany czas czytania w sekundach do czytelnej etykiety PL. */
export function formatReadingTime(seconds: number): string {
  if (seconds < 60) return `${seconds} s czytania`;
  const minutes = Math.round(seconds / 60);
  return `${minutes} min czytania`;
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
];

const relativeFormatter = new Intl.RelativeTimeFormat('pl', { numeric: 'auto' });

/** Formatuje znacznik czasu jako względny czas po polsku (np. "3 godziny temu"). */
export function formatRelativeTime(timestamp: number): string {
  const diffSeconds = Math.round((timestamp - Date.now()) / 1000);
  const absSeconds = Math.abs(diffSeconds);

  if (absSeconds < 45) return 'przed chwilą';

  for (const [unit, secondsInUnit] of RELATIVE_UNITS) {
    if (absSeconds >= secondsInUnit) {
      const value = Math.round(diffSeconds / secondsInUnit);
      return relativeFormatter.format(value, unit);
    }
  }
  return relativeFormatter.format(Math.round(diffSeconds / 60), 'minute');
}
