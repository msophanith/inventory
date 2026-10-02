import * as XLSX from 'xlsx';
import type { Movement } from '@/services/movement';
import { formatDateTime } from '@/utils/date';

type MovementRow = {
  '#': number;
  'Movement ID': string;
  'Product': string;
  'Type': string;
  'Quantity': string;
  'Unit Price ($)': string;
  'Sell Price ($)': string;
  'Remaining Stock': string | number;
  'Condition': string;
  'Reference / Note': string;
  'Date & Time': string;
};

function buildRow(item: Movement, index: number): MovementRow {
  const isDamaged = Boolean(
    item.isDamaged || item.reference?.toLowerCase() === 'damage',
  );
  const qtyPrefix =
    item.type === 'OUT' ? '-' : item.type === 'RETURN' ? '' : '+';
  const qtySuffix = item.type === 'RETURN' ? ' (Ret)' : '';

  const unitPrice = item.unitPrice != null ? `$${item.unitPrice.toFixed(2)}` : '-';
  const sellPrice = item.product?.sellPrice != null
    ? `$${item.product.sellPrice.toFixed(2)}`
    : '-';

  return {
    '#': index + 1,
    'Movement ID': `#${item.id.slice(0, 8)}`,
    'Product': item.product?.name ?? item.productId ?? '',
    'Type': item.type,
    'Quantity': `${qtyPrefix}${item.quantity}${qtySuffix}`,
    'Unit Price ($)': unitPrice,
    'Sell Price ($)': sellPrice,
    'Remaining Stock': item.product?.quantity ?? '-',
    'Condition': isDamaged ? 'Damaged' : 'Good',
    'Reference / Note': item.reference || item.note || '-',
    'Date & Time': formatDateTime(item.createdAt, 'DD MMM YYYY, HH:mm'),
  };
}

export function exportMovementsToExcel(
  movements: Movement[],
  filename = 'movements',
): void {
  const rows: MovementRow[] = movements.map((m, i) => buildRow(m, i));
  const ws = XLSX.utils.json_to_sheet(rows);

  // Column widths
  ws['!cols'] = [
    { wch: 5 }, { wch: 14 }, { wch: 28 }, { wch: 10 }, { wch: 12 },
    { wch: 16 }, { wch: 14 }, { wch: 16 }, { wch: 12 }, { wch: 30 }, { wch: 22 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Movements');
  XLSX.writeFile(wb, `${filename}_${Date.now()}.xlsx`);
}
