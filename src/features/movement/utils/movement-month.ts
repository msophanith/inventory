import type { Movement } from '@/services/movement';
import { formatDate, getMoment } from '@/utils/date';

export interface MonthOption {
  value: string;
  label: string;
}

export function getMovementMonthOptions(movements: Movement[]): MonthOption[] {
  const map = new Map<string, string>();

  movements.forEach((item) => {
    if (!item.createdAt) return;
    const m = getMoment(item.createdAt);
    if (m) {
      const key = m.format('YYYY-MM');
      const label = m.format('MMMM YYYY');
      map.set(key, label);
    }
  });

  // Always ensure current month is in options even if empty
  const currentKey = formatDate(new Date(), 'YYYY-MM');
  const currentLabel = formatDate(new Date(), 'MMMM YYYY');
  if (currentKey && currentLabel && !map.has(currentKey)) {
    map.set(currentKey, currentLabel);
  }

  const sortedKeys = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));

  return [
    { value: 'ALL', label: 'All Months' },
    ...sortedKeys.map((key) => ({
      value: key,
      label: map.get(key) || key,
    })),
  ];
}
