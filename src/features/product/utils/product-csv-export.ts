import { productService } from '../../../services';
import { type Product } from '../../../services/product';
import { formatDate } from '../../../utils/date';

export async function exportAllProductsToCsv(): Promise<void> {
  const response = await productService.getAll({ limit: 10000 });
  const products: Product[] = response.data || [];

  const headers = [
    'ID',
    'Product Name',
    'Barcode',
    'Category',
    'Shelf Location',
    'Current Stock',
    'Unit',
    'Buy Price (USD)',
    'Sell Price (USD)',
    'Min Stock Alert',
    'Created At',
  ];

  const escapeCsvValue = (val: unknown) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = products.map((p) => [
    escapeCsvValue(p.id),
    escapeCsvValue(p.name),
    escapeCsvValue(p.barcode || '-'),
    escapeCsvValue(p.category || '-'),
    escapeCsvValue(p.shelf || '-'),
    escapeCsvValue(p.quantity),
    escapeCsvValue(p.unit || 'pcs'),
    escapeCsvValue(p.buyPrice),
    escapeCsvValue(p.sellPrice),
    escapeCsvValue(p.minStock),
    escapeCsvValue(formatDate(p.createdAt, 'yyyy-MM-dd HH:mm')),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join(
    '\n',
  );

  // UTF-8 BOM for Excel Khmer/UTF-8 compatibility
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const todayStr = formatDate(new Date(), 'yyyy-MM-dd');
  link.setAttribute('href', url);
  link.setAttribute('download', `all_products_catalog_${todayStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
