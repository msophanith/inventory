import type { Movement } from '../../../services/movement';
import { formatDate } from '../../../utils/date';

export type RevenueRange = 7 | 14 | 30;

export interface DailyRevenueResult {
  labels: string[];
  values: number[];
  totalInRange: number;
  avgPerDay: number;
  peakDay: { label: string; value: number };
}

export function buildDailyRevenue(
  movements: Movement[],
  days: RevenueRange,
): DailyRevenueResult {
  const now = new Date();
  const labels: string[] = [];
  const values: number[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = formatDate(d, 'yyyy-MM-dd', '');
    const label = formatDate(d, days <= 7 ? 'EEE' : 'MMM dd', '');
    labels.push(label);

    const dayTotal = movements
      .filter(
        (m) =>
          m.type === 'OUT' &&
          !m.isDamaged &&
          formatDate(m.createdAt, 'yyyy-MM-dd', '') === key,
      )
      .reduce(
        (sum, m) =>
          sum +
          Math.abs(m.quantity || 0) *
            (m.unitPrice ?? m.product?.sellPrice ?? 0),
        0,
      );

    values.push(dayTotal);
  }

  const totalInRange = values.reduce((a, b) => a + b, 0);
  const avgPerDay = values.length > 0 ? totalInRange / values.length : 0;

  let peakIdx = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i] > values[peakIdx]) {
      peakIdx = i;
    }
  }

  return {
    labels,
    values,
    totalInRange,
    avgPerDay,
    peakDay: {
      label: labels[peakIdx] || '',
      value: values[peakIdx] || 0,
    },
  };
}
