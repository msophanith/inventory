import type { ProductReportItem } from '../types/report.types';
import { downloadFileWithOptionalPassword } from './export-helper';

/**
 * Download Product Breakdown Report as CSV file with optional password
 */
export async function exportReportToCsv(
  productReports: ProductReportItem[],
  monthLabel: string,
  password?: string,
) {
  const headers = [
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

  const rows = productReports.map((p) => [
    `"${(p.productName || '').replace(/"/g, '""')}"`,
    `"${(p.category || '').replace(/"/g, '""')}"`,
    p.buyPrice,
    p.sellPrice,
    p.quantitySold,
    p.quantityReturned,
    p.quantityDamaged,
    p.totalSales,
    p.totalCost,
    p.netMargin,
    `"${p.marginPercentage.toFixed(2)}%"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const cleanMonth = monthLabel.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Sales_Margin_Report_${cleanMonth}.csv`;

  await downloadFileWithOptionalPassword(
    csvContent,
    filename,
    'text/csv;charset=utf-8;',
    password,
  );
}
