import * as XLSX from 'xlsx';
import { formatDateTime } from '../../../utils/date';
import type { Movement } from '../../../services/movement';
import { downloadFileWithOptionalPassword } from './export-helper';

/**
 * Download Monthly Product In (Stock In / Purchases) as Excel (.xlsx) file
 */
export async function exportProductInToExcel(
  movements: Movement[],
  monthLabel: string,
  password?: string,
) {
  const wb = XLSX.utils.book_new();
  const dateStr = formatDateTime(new Date(), 'yyyy-MM-dd HH:mm');

  // filter only 'IN'
  const inMovements = movements.filter((m) => m.type === 'IN');

  const txHeader = [
    'Transaction ID',
    'Date & Time',
    'Product Name',
    'Quantity',
    'Unit Cost',
    'Total Cost',
    'Reason / Note',
  ];

  const txRows = inMovements.map((m) => {
    const dateFormatted = formatDateTime(m.createdAt, 'yyyy-MM-dd HH:mm:ss', '');
    const unitCost = m.unitPrice ?? m.product?.buyPrice ?? 0;
    const totalCost = unitCost * m.quantity;
    return [
      m.id,
      dateFormatted,
      m.product?.name || m.productId,
      m.quantity,
      unitCost,
      totalCost,
      m.reference || m.note || '',
    ];
  });

  const txSheet = XLSX.utils.aoa_to_sheet([
    ['MONTHLY PRODUCT IN REPORT'],
    [`Period: ${monthLabel}`],
    [`Generated Date: ${dateStr}`],
    [''],
    txHeader,
    ...txRows,
  ]);
  XLSX.utils.book_append_sheet(wb, txSheet, 'Product In');

  const cleanMonth = monthLabel.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Product_In_Report_${cleanMonth}.xlsx`;

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  await downloadFileWithOptionalPassword(
    excelBuffer,
    filename,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    password,
  );
}
