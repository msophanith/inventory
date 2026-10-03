import type { Product } from '@/services/product';
import type { ProductFormValues } from '@/features/product/schema/product.schema';
import type { ProductChangeDetail } from '@/services/activity-log.types';

const FIELD_LABELS: Record<string, string> = {
  name: 'Product Name',
  barcode: 'Barcode',
  category: 'Category',
  buyPrice: 'Cost Price',
  sellPrice: 'Selling Price',
  quantity: 'Stock Quantity',
  minStock: 'Min Stock Alert',
  unit: 'Unit',
  shelf: 'Shelf Location',
  description: 'Description',
  imageUrl: 'Product Image',
};

export function computeProductDiff(
  oldProduct: Product | null | undefined,
  newProduct: Partial<ProductFormValues & Product>,
): ProductChangeDetail[] {
  if (!oldProduct) return [];

  const changes: ProductChangeDetail[] = [];
  const fields = Object.keys(FIELD_LABELS);
  const oldRecord = oldProduct as unknown as Record<string, unknown>;
  const newRecord = newProduct as unknown as Record<string, unknown>;

  for (const field of fields) {
    const oldVal = oldRecord[field];
    const newVal = newRecord[field];

    if (newVal !== undefined && newVal !== null && oldVal !== newVal) {
      if (typeof oldVal === 'number' && typeof newVal === 'number') {
        if (Math.abs(oldVal - newVal) > 0.0001) {
          changes.push({
            field,
            label: FIELD_LABELS[field] || field,
            oldValue: oldVal,
            newValue: newVal,
          });
        }
      } else if (String(oldVal || '').trim() !== String(newVal || '').trim()) {
        changes.push({
          field,
          label: FIELD_LABELS[field] || field,
          oldValue: oldVal as string,
          newValue: newVal as string,
        });
      }
    }
  }

  return changes;
}
