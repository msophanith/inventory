import type { Movement } from '../../../services/movement';
import type { CalculatedMovementItem, MonthOption } from '../types/report.types';
import { formatDate } from '../../../utils/date';
import {
  calculateProductReport,
  calculateReportSummary,
} from './report-product-calculator';

export { calculateProductReport, calculateReportSummary };

export function getAvailableMonths(movements: Movement[]): MonthOption[] {
  const monthMap = new Map<string, string>();

  movements.forEach((item) => {
    if (!item.createdAt) return;
    const key = formatDate(item.createdAt, 'yyyy-MM', '');
    const label = formatDate(item.createdAt, 'MMMM yyyy', '');
    if (key && label) {
      monthMap.set(key, label);
    }
  });

  const sortedKeys = Array.from(monthMap.keys()).sort((a, b) =>
    b.localeCompare(a),
  );

  return [
    { value: 'ALL', label: 'All Months' },
    ...sortedKeys.map((key) => ({
      value: key,
      label: monthMap.get(key) || key,
    })),
  ];
}

export function filterMovementsByMonth(
  movements: Movement[],
  selectedMonth: string,
): Movement[] {
  if (!selectedMonth || selectedMonth === 'ALL') {
    return movements;
  }

  return movements.filter((item) => {
    if (!item.createdAt) return false;
    const itemMonth = formatDate(item.createdAt, 'yyyy-MM', '');
    return itemMonth === selectedMonth;
  });
}

/**
 * Compute detailed sale, cost, and margin for a single movement item.
 */
export function calculateMovementItem(item: Movement): CalculatedMovementItem {
  const buyPrice = item.product?.buyPrice ?? 0;
  const sellPrice = item.product?.sellPrice ?? 0;
  const unitPrice = item.unitPrice ?? sellPrice;
  const quantity = Math.abs(item.quantity || 0);

  const isDamaged = Boolean(
    item.isDamaged || item.reference?.toLowerCase() === 'damage',
  );
  let effectiveSaleAmount = 0;
  let effectiveCostAmount = 0;
  let effectiveMarginAmount = 0;

  if (item.type === 'OUT') {
    if (isDamaged) {
      effectiveSaleAmount = -(quantity * unitPrice);
      effectiveCostAmount = quantity * buyPrice;
      effectiveMarginAmount = effectiveSaleAmount - effectiveCostAmount;
    } else {
      effectiveSaleAmount = quantity * unitPrice;
      effectiveCostAmount = quantity * buyPrice;
      effectiveMarginAmount = effectiveSaleAmount - effectiveCostAmount;
    }
  } else if (item.type === 'RETURN') {
    if (isDamaged) {
      effectiveSaleAmount = -(quantity * unitPrice);
      effectiveCostAmount = quantity * buyPrice;
      effectiveMarginAmount = effectiveSaleAmount - effectiveCostAmount;
    } else {
      effectiveSaleAmount = -(quantity * unitPrice);
      effectiveCostAmount = -(quantity * buyPrice);
      effectiveMarginAmount = effectiveSaleAmount - effectiveCostAmount;
    }
  }

  return {
    ...item,
    effectiveSaleAmount,
    effectiveCostAmount,
    effectiveMarginAmount,
  };
}
