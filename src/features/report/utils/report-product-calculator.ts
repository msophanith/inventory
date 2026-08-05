import type { Movement } from '../../../services/movement';
import type { MonthlyReportSummary, ProductReportItem } from '../types/report.types';
import { calculateMovementItem } from './report-calculator';

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
