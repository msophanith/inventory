import * as XLSX from 'xlsx';
import { formatDateTime } from '../../../utils/date';
import type { Product } from '../../../services/product';
import { downloadFileWithOptionalPassword } from './export-helper';

/**
 * Download New Products as Excel (.xlsx) file
 */
export async function exportNewProductToExcel(
  products: Product[],
  monthLabel: string,
  password?: string,
) {
  const wb = XLSX.utils.book_new();
  const dateStr = formatDateTime(new Date(), 'yyyy-MM-dd HH:mm');

  const header = [
    'Product ID',
    'Barcode',
    'Product Name',
    'Category',
    'Buy Price',
    'Sell Price',
    'Current Stock',
    'Created At',
  ];

  const rows = products.map((p) => {
    return [
      p.id,
      p.barcode || '',
      p.name,
      p.category,
      p.buyPrice,
      p.sellPrice,
      p.quantity,
      formatDateTime(p.createdAt, 'yyyy-MM-dd HH:mm:ss', ''),
    ];
  });

  const sheet = XLSX.utils.aoa_to_sheet([
    ['NEW PRODUCTS REPORT'],
    [`Period: ${monthLabel}`],
    [`Generated Date: ${dateStr}`],
    [''],
    header,
    ...rows,
  ]);
  XLSX.utils.book_append_sheet(wb, sheet, 'New Products');

  const cleanMonth = monthLabel.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `New_Products_Report_${cleanMonth}.xlsx`;

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  await downloadFileWithOptionalPassword(
    excelBuffer,
    filename,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    password,
  );
}
