import type { Movement } from '@/services/movement';

/** OUT reasons that move stock out but are NOT customer sales. */
const NON_SALE_OUT_REASONS = ['damage', 'transfer out', 'adjustment'];

export function isDamagedMovement(item: Movement): boolean {
  if (item.isDamaged) return true;
  const ref = (item.reference || '').trim().toLowerCase();
  if (ref.includes('damage')) return true;
  const note = (item.note || '').trim().toLowerCase();
  return note.includes('damage');
}

/** True only for OUT movements that represent real revenue (POS or manual sale). */
export function isSaleOutMovement(item: Movement): boolean {
  if (item.type !== 'OUT' || isDamagedMovement(item)) return false;
  const ref = (item.reference || '').trim().toLowerCase();
  return !NON_SALE_OUT_REASONS.includes(ref);
}

/** Groups POS line items into one order key; manual sales count individually. */
export function getSaleOrderKey(item: Movement): string {
  const ref = item.reference || '';
  return ref.startsWith('POS Sale #') ? ref : `manual-${item.id}`;
}
