import { addHours, format, parseISO } from 'date-fns';

/**
 * Standard offset in hours from UTC/Ireland server response to Phnom Penh local time (UTC+7).
 */
export const PHNOM_PENH_TZ_OFFSET_HOURS = 7;

/**
 * Safely parse a date value (Date, ISO string, timestamp) into a Date instance.
 */
export function parseDate(
  value: Date | string | number | null | undefined,
): Date | null {
  if (!value) return null;
  try {
    const parsed =
      typeof value === 'string'
        ? parseISO(value)
        : value instanceof Date
          ? value
          : new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}

/**
 * Adjust date by timezone offset hours (+7 hours for Phnom Penh by default).
 */
export function getAdjustedDate(
  value: Date | string | number | null | undefined,
  offsetHours = PHNOM_PENH_TZ_OFFSET_HOURS,
): Date | null {
  const parsed = parseDate(value);
  if (!parsed) return null;
  return offsetHours ? addHours(parsed, offsetHours) : parsed;
}

/**
 * Format a date into a formatted string (default pattern: 'dd MMM yyyy').
 * Applies +7 hours Phnom Penh timezone adjustment by default.
 */
export function formatDate(
  value: Date | string | number | null | undefined,
  pattern = 'dd MMM yyyy',
  fallback = 'N/A',
  offsetHours = PHNOM_PENH_TZ_OFFSET_HOURS,
): string {
  const adjusted = getAdjustedDate(value, offsetHours);
  if (!adjusted) return fallback;
  return format(adjusted, pattern);
}

/**
 * Format a date & time into a formatted string (default pattern: 'dd MMM yyyy, HH:mm').
 * Applies +7 hours Phnom Penh timezone adjustment by default.
 */
export function formatDateTime(
  value: Date | string | number | null | undefined,
  pattern = 'dd MMM yyyy, HH:mm',
  fallback = 'N/A',
  offsetHours = PHNOM_PENH_TZ_OFFSET_HOURS,
): string {
  return formatDate(value, pattern, fallback, offsetHours);
}
