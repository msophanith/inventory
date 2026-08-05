import type { Movement } from '../../../services/movement';
import { calculateMovementItem } from '../../report/utils/report-calculator';
import { formatDate } from '../../../utils/date';

export type GroupByPeriod = 'monthly' | 'daily' | 'category';

export interface SalesMarginGroup {
  key: string;
  label: string;
  totalSales: number;
  totalCost: number;
  totalMargin: number;
  totalDamage: number;
  marginPct: number;
  transactionCount: number;
}

export function aggregateSalesAndMargin(
  movements: Movement[],
  groupBy: GroupByPeriod = 'monthly',
): SalesMarginGroup[] {
  const map = new Map<
    string,
    {
      label: string;
      grossSales: number;
      cost: number;
      damage: number;
      count: number;
    }
  >();

  movements.forEach((item) => {
    if (!item.createdAt || (item.type !== 'OUT' && item.type !== 'RETURN'))
      return;
    const calc = calculateMovementItem(item);

    let key: string;
    let label: string;

    if (groupBy === 'monthly') {
      key = formatDate(item.createdAt, 'yyyy-MM', '');
      label = formatDate(item.createdAt, 'MMM yyyy', '');
    } else if (groupBy === 'daily') {
      key = formatDate(item.createdAt, 'yyyy-MM-dd', '');
      label = formatDate(item.createdAt, 'MMM dd', '');
    } else {
      key = item.product?.category || 'General';
      label = key;
    }

    if (!key) return;

    const quantity = Math.abs(item.quantity || 0);
    const isDamaged = Boolean(
      item.isDamaged || item.reference?.toLowerCase() === 'damage',
    );
    const damageValue = isDamaged
      ? quantity * (item.unitPrice ?? item.product?.sellPrice ?? 0)
      : 0;

    const existing = map.get(key) || {
      label,
      grossSales: 0,
      cost: 0,
      damage: 0,
      count: 0,
    };

    if (isDamaged) {
      existing.damage += damageValue;
      existing.cost += calc.effectiveCostAmount;
    } else {
      existing.grossSales += calc.effectiveSaleAmount;
      existing.cost += calc.effectiveCostAmount;
    }
    existing.count += 1;

    map.set(key, existing);
  });

  const keys = Array.from(map.keys());
  if (groupBy !== 'category') {
    keys.sort((a, b) => a.localeCompare(b));
  }

  // Limit to last 10 periods or top 8 categories
  const selectedKeys =
    groupBy === 'category' ? keys.slice(0, 8) : keys.slice(-10);

  return selectedKeys.map((k) => {
    const data = map.get(k)!;
    const totalSales = Math.max(0, data.grossSales - data.damage);
    const totalCost = Math.max(0, data.cost);
    const totalMargin = totalSales - totalCost;
    const marginPct = totalSales > 0 ? (totalMargin / totalSales) * 100 : 0;
    return {
      key: k,
      label: data.label,
      totalSales,
      totalCost,
      totalMargin,
      totalDamage: data.damage,
      marginPct,
      transactionCount: data.count,
    };
  });
}

export function calculateTotals(groups: SalesMarginGroup[]) {
  let totalSales = 0;
  let totalMargin = 0;
  let totalDamage = 0;

  groups.forEach((g) => {
    totalSales += g.totalSales;
    totalMargin += g.totalMargin;
    totalDamage += g.totalDamage;
  });

  const overallMarginPct =
    totalSales > 0 ? (totalMargin / totalSales) * 100 : 0;

  return { totalSales, totalMargin, totalDamage, overallMarginPct };
}
