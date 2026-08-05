import type { ReceiptData } from '../features/sell/types/sell.types';
import type { Movement } from './movement';
import type { Product } from './product';
import { formatDateTime } from '../utils/date';
import { formatCurrencyKhr, formatCurrencyUsd } from '../utils/currency';

export function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function formatMovementNotificationMessage(
  movement: Movement,
  product?: Product | null,
): string {
  const isDamaged = Boolean(
    movement.isDamaged || movement.reference?.toLowerCase() === 'damage',
  );
  let typeEmoji = '📦';
  if (movement.type === 'IN') typeEmoji = '📥';
  else if (movement.type === 'OUT') typeEmoji = isDamaged ? '⚠️' : '📤';
  else if (movement.type === 'RETURN') typeEmoji = '🔄';

  const name =
    product?.name || movement.product?.name || `Product #${movement.productId}`;
  const qty = Math.abs(movement.quantity || 0);
  const unitPrice = movement.unitPrice ?? product?.sellPrice ?? 0;
  const totalPrice = qty * unitPrice;

  return [
    `${typeEmoji} <b>Stock Movement (${escapeHtml(movement.type)})</b>`,
    `<b>Product:</b> ${escapeHtml(name)}`,
    `<b>Qty:</b> ${qty} ${escapeHtml(product?.unit || 'units')}`,
    `<b>Total Value:</b> ${formatCurrencyUsd(totalPrice)} / ${formatCurrencyKhr(totalPrice)}${isDamaged ? ' (🚨 Damaged)' : ''}`,
    `<b>Date:</b> ${formatDateTime(movement.createdAt)}`,
  ].join('\n');
}

export function formatSaleNotificationCaption(receipt: ReceiptData): string {
  const itemsFormatted = receipt.items
    .map(
      (i) =>
        `• <b>${i.quantity}x</b> ${escapeHtml(i.product.name)} = <b>${formatCurrencyUsd(i.quantity * i.unitPrice)}</b>`,
    )
    .join('\n');

  return [
    `🛍️ <b>Sale Completed (#${escapeHtml(receipt.orderId)})</b>`,
    '----------------------------------',
    itemsFormatted,
    '----------------------------------',
    `<b>Grand Total:</b> ${formatCurrencyUsd(receipt.total)} (${formatCurrencyKhr(receipt.total)})`,
    `<b>Payment:</b> ${escapeHtml(receipt.paymentMethod.toUpperCase())}`,
    `<b>Cashier:</b> ${escapeHtml(receipt.soldBy || 'Admin')}`,
    `<b>Date:</b> ${formatDateTime(receipt.createdAt)}`,
    '📄 <i>PDF Invoice Attached Below</i>',
  ].join('\n');
}

export function formatLowStockAlertMessage(product: Product): string {
  const isOut = product.quantity <= 0;
  const header = isOut
    ? '🚨 <b>CRITICAL: OUT OF STOCK ALERT</b>'
    : '⚠️ <b>WARNING: LOW STOCK ALERT</b>';
  return [
    header,
    `<b>Product:</b> ${escapeHtml(product.name)}`,
    `<b>Category:</b> ${escapeHtml(product.category)}`,
    `<b>Current Stock:</b> <code>${product.quantity} ${escapeHtml(product.unit)}</code>`,
    `<b>Min Required Stock:</b> <code>${product.minStock} ${escapeHtml(product.unit)}</code>`,
    `<b>Status:</b> ${isOut ? '❌ Item is completely out of stock!' : '📉 Stock is running critically low!'}`,
    '<i>Please restock this product as soon as possible.</i>',
  ].join('\n');
}
