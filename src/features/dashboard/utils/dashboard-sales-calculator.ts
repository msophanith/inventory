import type { Movement } from '@/services/movement';
import {
  isToday,
  isYesterday,
  isWithinLastNDays,
  isCurrentMonth,
} from '@/utils/date';
import {
  getSaleOrderKey,
  isDamagedMovement,
  isSaleOutMovement,
} from './sale-movement';

export type DashboardSalesFilter =
  | 'TODAY'
  | 'YESTERDAY'
  | 'LAST_7'
  | 'LAST_15'
  | 'THIS_MONTH'
  | 'ALL';

export interface DashboardSalesStats {
  totalSales: number;
  totalOrders: number;
  totalItemsSold: number;
  totalCost: number;
  totalDamageLoss: number;
  grossProfit: number;
  marginRate: number;
}

export function calculateDashboardSales(
  movements: Movement[],
  filter: DashboardSalesFilter,
): DashboardSalesStats {
  const filtered = movements.filter((item) => {
    if (filter === 'TODAY') return isToday(item.createdAt);
    if (filter === 'YESTERDAY') return isYesterday(item.createdAt);
    if (filter === 'LAST_7') return isWithinLastNDays(item.createdAt, 7);
    if (filter === 'LAST_15') return isWithinLastNDays(item.createdAt, 15);
    if (filter === 'THIS_MONTH') return isCurrentMonth(item.createdAt);
    return true;
  });

  let totalSales = 0;
  let totalCost = 0;
  let totalItemsSold = 0;
  let totalDamageLoss = 0;
  const orderKeys = new Set<string>();

  for (const item of filtered) {
    const qty = Math.abs(item.quantity || 0);
    const buyPrice = item.product?.buyPrice ?? 0;
    const sellPrice = item.unitPrice ?? item.product?.sellPrice ?? 0;
    const isDamaged = isDamagedMovement(item);

    if (isSaleOutMovement(item)) {
      totalSales += qty * sellPrice;
      totalCost += qty * buyPrice;
      totalItemsSold += qty;
      orderKeys.add(getSaleOrderKey(item));
    } else if (item.type === 'OUT' && isDamaged) {
      const costPerUnit = buyPrice > 0 ? buyPrice : (item.unitPrice ?? sellPrice);
      totalDamageLoss += qty * costPerUnit;
    } else if (item.type === 'RETURN') {
      totalSales -= qty * sellPrice;
      totalItemsSold -= qty;
      if (isDamaged) {
        const costPerUnit = buyPrice > 0 ? buyPrice : (item.unitPrice ?? sellPrice);
        totalDamageLoss += qty * costPerUnit;
      } else {
        totalCost -= qty * buyPrice;
      }
    }
  }

  const grossProfit = Math.max(0, totalSales - totalCost - totalDamageLoss);
  const marginRate =
    totalSales > 0 ? Math.round((grossProfit / totalSales) * 100) : 0;

  return {
    totalSales: Math.max(0, Math.round(totalSales * 100) / 100),
    totalOrders: orderKeys.size,
    totalItemsSold: Math.max(0, totalItemsSold),
    totalCost: Math.max(0, Math.round(totalCost * 100) / 100),
    totalDamageLoss: Math.round(totalDamageLoss * 100) / 100,
    grossProfit: Math.round(grossProfit * 100) / 100,
    marginRate,
  };
}
