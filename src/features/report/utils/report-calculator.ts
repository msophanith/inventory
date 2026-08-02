import type { Movement } from '../../../services/movement';
import type {
  CalculatedMovementItem,
  MonthlyReportSummary,
  MonthOption,
  ProductReportItem,
} from '../types/report.types';
import { formatDate } from '../../../utils/date';

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
 *
 * Rules:
 * 1. Normal Sale (OUT, not damaged):
 *    Sale = qty * unitPrice, Cost = qty * buyPrice, Margin = Sale - Cost
 * 2. Normal Return (RETURN, not damaged):
 *    Sale = - (qty * unitPrice), Cost = - (qty * buyPrice), Margin = Sale - Cost
 * 3. Product Return is Damaged / Damaged Out:
 *    Total Sell = - (qty * unitPrice) [Deducts total damage amount from total sell]
 *    Cost = qty * buyPrice [COGS write-off]
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
      // Product return is damaged -> deduct total damage amount (qty * unitPrice) from total sell
      effectiveSaleAmount = -(quantity * unitPrice);
      effectiveCostAmount = quantity * buyPrice;
      effectiveMarginAmount = effectiveSaleAmount - effectiveCostAmount;
    } else {
      // Normal return -> deduct sale price from total sell, refund cost to inventory
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

export function calculateReportSummary(
  movements: Movement[],
): MonthlyReportSummary {
  let totalSales = 0;
  let totalCost = 0;
  let totalItemsSold = 0;
  let totalItemsReturned = 0;
  let totalItemsDamaged = 0;
  let totalLosses = 0;
  let orderCount = 0;

  movements.forEach((rawItem) => {
    const calc = calculateMovementItem(rawItem);
    const quantity = Math.abs(rawItem.quantity || 0);
    const isDamaged = Boolean(
      rawItem.isDamaged || rawItem.reference?.toLowerCase() === 'damage',
    );
    const itemDamageValue =
      quantity * (rawItem.unitPrice ?? rawItem.product?.sellPrice ?? 0);

    if (rawItem.type === 'OUT') {
      orderCount++;
      if (isDamaged) {
        totalItemsDamaged += quantity;
        totalLosses += itemDamageValue;
      } else {
        totalItemsSold += quantity;
      }
      totalCost += calc.effectiveCostAmount;
      totalSales += calc.effectiveSaleAmount;
    } else if (rawItem.type === 'RETURN') {
      totalItemsReturned += quantity;
      if (isDamaged) {
        totalItemsDamaged += quantity;
        totalLosses += itemDamageValue;
      }
      totalCost += calc.effectiveCostAmount;
      totalSales += calc.effectiveSaleAmount;
    }
  });

  const netMargin = totalSales - totalCost;
  const marginPercentage = totalSales > 0 ? (netMargin / totalSales) * 100 : 0;

  return {
    totalSales,
    totalCost,
    netMargin,
    marginPercentage,
    totalItemsSold,
    totalItemsReturned,
    totalItemsDamaged,
    totalLosses,
    orderCount,
  };
}

export function calculateProductReport(
  movements: Movement[],
): ProductReportItem[] {
  const productMap = new Map<string, ProductReportItem>();

  movements.forEach((rawItem) => {
    if (!rawItem.productId && !rawItem.product?.id) return;
    const calc = calculateMovementItem(rawItem);
    const productId = rawItem.productId || rawItem.product?.id || 'unknown';
    const productName = rawItem.product?.name || `Product #${productId}`;
    const category = rawItem.product?.category || 'General';
    const buyPrice = rawItem.product?.buyPrice ?? 0;
    const sellPrice = rawItem.product?.sellPrice ?? 0;
    const quantity = Math.abs(rawItem.quantity || 0);
    const isDamaged = Boolean(
      rawItem.isDamaged || rawItem.reference?.toLowerCase() === 'damage',
    );

    if (!productMap.has(productId)) {
      productMap.set(productId, {
        productId,
        productName,
        category,
        buyPrice,
        sellPrice,
        quantitySold: 0,
        quantityReturned: 0,
        quantityDamaged: 0,
        totalSales: 0,
        totalCost: 0,
        netMargin: 0,
        marginPercentage: 0,
      });
    }

    const item = productMap.get(productId)!;

    if (rawItem.type === 'OUT') {
      if (isDamaged) {
        item.quantityDamaged += quantity;
      } else {
        item.quantitySold += quantity;
      }
      item.totalCost += calc.effectiveCostAmount;
      item.totalSales += calc.effectiveSaleAmount;
    } else if (rawItem.type === 'RETURN') {
      item.quantityReturned += quantity;
      if (isDamaged) {
        item.quantityDamaged += quantity;
      }
      item.totalCost += calc.effectiveCostAmount;
      item.totalSales += calc.effectiveSaleAmount;
    }
  });

  const results = Array.from(productMap.values()).map((p) => {
    const netMargin = p.totalSales - p.totalCost;
    const marginPercentage =
      p.totalSales > 0 ? (netMargin / p.totalSales) * 100 : 0;
    return {
      ...p,
      netMargin,
      marginPercentage,
    };
  });

  return results.sort((a, b) => b.totalSales - a.totalSales);
}
