import * as XLSX from 'xlsx';
import { formatDateTime } from '../../../utils/date';
import type { Movement } from '../../../services/movement';
import type { MonthlyReportSummary, ProductReportItem } from '../types/report.types';
import { calculateMovementItem } from './report-calculator';
import { downloadFileWithOptionalPassword } from './export-helper';
import { exportReportToCsv } from './csv-export';

export { exportReportToCsv };

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Download complete Monthly Sales and Margin Report as Excel (.xlsx) file,
 * with optional password protection.
 */
export async function exportReportToExcel(
  summary: MonthlyReportSummary,
  productReports: ProductReportItem[],
  movements: Movement[],
  monthLabel: string,
  password?: string,
) {
  const wb = XLSX.utils.book_new();
  const dateStr = formatDateTime(new Date(), 'yyyy-MM-dd HH:mm');

  // Sheet 1: Executive Summary
  const summaryData = [
    ['MONTHLY SALES & MARGIN REPORT'],
    [`Period: ${monthLabel}`],
    [`Generated Date: ${dateStr}`],
    [''],
    ['KEY PERFORMANCE METRICS'],
    ['Metric', 'Value'],
    ['Total Sales Amount', formatCurrency(summary.totalSales)],
    ['Total Cost of Goods (COGS)', formatCurrency(summary.totalCost)],
    ['Net Profit Margin', formatCurrency(summary.netMargin)],
    ['Margin Percentage', `${summary.marginPercentage.toFixed(2)}%`],
    ['Total Items Sold', summary.totalItemsSold],
    ['Total Items Returned', summary.totalItemsReturned],
    ['Total Items Damaged', summary.totalItemsDamaged],
    ['Total Damage Losses', formatCurrency(summary.totalLosses)],
    ['Total Transactions', summary.orderCount],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Executive Summary');

  // Sheet 2: Product Breakdown
  const productHeader = [
    'Product Name',
    'Category',
    'Buy Price',
    'Sell Price',
    'Units Sold',
    'Units Returned',
    'Units Damaged',
    'Total Sales',
    'Total Cost',
    'Net Margin',
    'Margin %',
  ];

  const productRows = productReports.map((p) => [
    p.productName,
    p.category,
    p.buyPrice,
    p.sellPrice,
    p.quantitySold,
    p.quantityReturned,
    p.quantityDamaged,
    p.totalSales,
    p.totalCost,
    p.netMargin,
    `${p.marginPercentage.toFixed(2)}%`,
  ]);

  const productSheet = XLSX.utils.aoa_to_sheet([productHeader, ...productRows]);
  XLSX.utils.book_append_sheet(wb, productSheet, 'Product Summary');

  // Sheet 3: Transaction Log
  const txHeader = [
    'Transaction ID',
    'Date & Time',
    'Product Name',
    'Movement Type',
    'Condition',
    'Quantity',
    'Unit Price',
    'Buy Price',
    'Effective Sales',
    'Effective Cost',
    'Effective Margin',
    'Reason / Note',
  ];

  const txRows = movements.map((m) => {
    const calc = calculateMovementItem(m);
    const dateFormatted = formatDateTime(m.createdAt, 'yyyy-MM-dd HH:mm:ss', '');
    const isDamaged = Boolean(m.isDamaged || m.reference?.toLowerCase() === 'damage');

    return [
      m.id,
      dateFormatted,
      m.product?.name || m.productId,
      m.type,
      isDamaged ? 'Damaged' : 'Good',
      m.quantity,
      m.unitPrice ?? m.product?.sellPrice ?? 0,
      m.product?.buyPrice ?? 0,
      calc.effectiveSaleAmount,
      calc.effectiveCostAmount,
      calc.effectiveMarginAmount,
      m.reference || m.note || '',
    ];
  });

  const txSheet = XLSX.utils.aoa_to_sheet([txHeader, ...txRows]);
  XLSX.utils.book_append_sheet(wb, txSheet, 'Transactions');

  const cleanMonth = monthLabel.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Sales_Margin_Report_${cleanMonth}.xlsx`;

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  await downloadFileWithOptionalPassword(
    excelBuffer,
    filename,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    password,
  );
}
