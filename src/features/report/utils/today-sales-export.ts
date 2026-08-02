import type { Movement } from '../../../services/movement';
import { formatDate } from '../../../utils/date';
import { calculateMovementItem } from './report-calculator';
import { downloadFileWithOptionalPassword } from './export-helper';

export async function exportTodaySalesToCsv(
  movements: Movement[],
  password?: string,
) {
  const todayStr = formatDate(new Date(), 'yyyy-MM-dd');

  const todayMovements = movements.filter((m) => {
    const mDateStr = formatDate(m.createdAt, 'yyyy-MM-dd');
    return mDateStr === todayStr;
  });

  const productMap = new Map<
    string,
    {
      productName: string;
      category: string;
      buyPrice: number;
      sellPrice: number;
      unitsSold: number;
      totalSales: number;
      totalCost: number;
      netProfit: number;
    }
  >();

  let totalSales = 0;
  let totalCost = 0;
  const processedOrders = new Set<string>();

  todayMovements.forEach((m) => {
    if (m.reference?.startsWith('POS Sale #')) {
      processedOrders.add(m.reference);
    }

    const calc = calculateMovementItem(m);
    const key = m.productId || m.product?.name || 'unknown';
    const existing = productMap.get(key) || {
      productName: m.product?.name || `Product #${m.productId}`,
      category: m.product?.category || 'General',
      buyPrice: m.product?.buyPrice || 0,
      sellPrice: m.unitPrice || m.product?.sellPrice || 0,
      unitsSold: 0,
      totalSales: 0,
      totalCost: 0,
      netProfit: 0,
    };

    if (
      m.type === 'OUT' &&
      !(m.isDamaged || m.reference?.toLowerCase() === 'damage')
    ) {
      existing.unitsSold += Math.abs(m.quantity || 0);
    }
    existing.totalSales += calc.effectiveSaleAmount;
    existing.totalCost += calc.effectiveCostAmount;
    existing.netProfit += calc.effectiveMarginAmount;

    totalSales += calc.effectiveSaleAmount;
    totalCost += calc.effectiveCostAmount;

    productMap.set(key, existing);
  });

  const netProfit = totalSales - totalCost;
  const marginPercent = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;
  const orderCount = processedOrders.size || todayMovements.length;

  const rows: (string | number)[][] = [
    ['TODAY SALES & NET PROFIT REPORT'],
    [`Date: ${todayStr}`],
    [''],
    ['EXECUTIVE SUMMARY'],
    ['Metric', 'Value'],
    ['Today Total Sales Amount', `$${totalSales.toFixed(2)}`],
    ['Today Total Cost (COGS)', `$${totalCost.toFixed(2)}`],
    ['Today Net Profit', `$${netProfit.toFixed(2)}`],
    ['Today Net Margin %', `${marginPercent.toFixed(2)}%`],
    ['Today Transactions', orderCount],
    [''],
    ['TODAY PRODUCT SALES BREAKDOWN'],
    [
      'Product Name',
      'Category',
      'Buy Price ($)',
      'Sell Price ($)',
      'Units Sold',
      'Total Sales ($)',
      'Total Cost ($)',
      'Net Profit ($)',
      'Margin %',
    ],
  ];

  Array.from(productMap.values()).forEach((p) => {
    if (p.unitsSold > 0 || p.totalSales !== 0) {
      const margin =
        p.totalSales > 0
          ? ((p.netProfit / p.totalSales) * 100).toFixed(2)
          : '0.00';
      rows.push([
        `"${(p.productName || '').replace(/"/g, '""')}"`,
        `"${(p.category || '').replace(/"/g, '""')}"`,
        p.buyPrice.toFixed(2),
        p.sellPrice.toFixed(2),
        p.unitsSold,
        p.totalSales.toFixed(2),
        p.totalCost.toFixed(2),
        p.netProfit.toFixed(2),
        `"${margin}%"`,
      ]);
    }
  });

  const csvContent = rows.map((r) => r.join(',')).join('\n');
  const filename = `Today_Sales_NetProfit_${todayStr}.csv`;

  await downloadFileWithOptionalPassword(
    csvContent,
    filename,
    'text/csv;charset=utf-8;',
    password,
  );
}
