import moment from 'moment';

export const PHNOM_PENH_TZ_OFFSET = '+07:00';
export const PHNOM_PENH_TZ_OFFSET_HOURS = 7;

function toMomentPattern(pattern: string): string {
  return pattern
    .replace(/\byyyy\b/g, 'YYYY')
    .replace(/\byy\b/g, 'YY')
    .replace(/\bEEEE\b/g, 'dddd')
    .replace(/\bEEE\b/g, 'ddd')
    .replace(/\bdd\b/g, 'DD')
    .replace(/\bd\b/g, 'D');
}

export function getMoment(
  value?: Date | string | number | null,
): moment.Moment | null {
  if (!value) return null;

  let m: moment.Moment;
  if (value instanceof Date) {
    m = moment(value);
  } else if (typeof value === 'string') {
    const str = value.trim();
    if (/[Zz]|[+-]\d{2}:?\d{2}$/.test(str)) {
      m = moment(str);
    } else {
      m = moment.utc(str);
    }
  } else {
    m = moment(value);
  }

  return m.isValid() ? m.utcOffset(PHNOM_PENH_TZ_OFFSET) : null;
}

export function parseDate(
  value: Date | string | number | null | undefined,
): Date | null {
  const m = getMoment(value);
  return m ? m.toDate() : null;
}

export function getAdjustedDate(
  value: Date | string | number | null | undefined,
): Date | null {
  return parseDate(value);
}

export function formatDate(
  value: Date | string | number | null | undefined,
  pattern = 'DD MMM YYYY',
  fallback = 'N/A',
): string {
  const m = getMoment(value);
  if (!m) return fallback;
  return m.format(toMomentPattern(pattern));
}

export function formatDateTime(
  value: Date | string | number | null | undefined,
  pattern = 'DD MMM YYYY, HH:mm',
  fallback = 'N/A',
): string {
  return formatDate(value, pattern, fallback);
}

export function isCurrentMonth(
  value: Date | string | number | null | undefined,
): boolean {
  const m = getMoment(value);
  if (!m) return false;
  const now = moment().utcOffset(PHNOM_PENH_TZ_OFFSET);
  return m.isSame(now, 'month') && m.isSame(now, 'year');
}

export function getCurrentMonthLabel(): string {
  return moment().utcOffset(PHNOM_PENH_TZ_OFFSET).format('MMMM YYYY');
}

export function isLastMonth(
  value: Date | string | number | null | undefined,
): boolean {
  const m = getMoment(value);
  if (!m) return false;
  const lastMonth = moment()
    .utcOffset(PHNOM_PENH_TZ_OFFSET)
    .subtract(1, 'month');
  return m.isSame(lastMonth, 'month') && m.isSame(lastMonth, 'year');
}

export function getLastMonthLabel(): string {
  return moment()
    .utcOffset(PHNOM_PENH_TZ_OFFSET)
    .subtract(1, 'month')
    .format('MMMM YYYY');
}
