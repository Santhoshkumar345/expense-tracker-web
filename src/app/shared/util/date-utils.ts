/**
 * Formats a Date as a `YYYY-MM-DD` string using its local calendar date.
 *
 * Deliberately avoids `Date.toISOString()`, which converts to UTC first —
 * in any positive-UTC-offset timezone that shifts local midnight back to
 * the previous day, silently saving the wrong date.
 */
export function toLocalIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a `YYYY-MM-DD` string as a local-midnight Date.
 *
 * Deliberately avoids `new Date(isoDateString)`, which parses date-only
 * strings as UTC midnight — off by a day locally in negative-UTC-offset
 * timezones once displayed back through a datepicker.
 */
export function parseLocalDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}
