import type { ReceiptData } from '@/features/sell/types/sell.types';
import type { Movement } from './movement';
import type { Product } from './product';
import { formatDateTime } from '@/utils/date';
import { formatCurrencyKhr, formatCurrencyUsd } from '@/utils/currency';

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

  const barcode = product?.barcode || movement.product?.barcode;

  return [
    `${typeEmoji} <b>Stock Movement (${escapeHtml(movement.type)})</b>`,
    `<b>Product:</b> ${escapeHtml(name)}`,
    barcode ? `<b>Barcode:</b> <code>${escapeHtml(barcode)}</code>` : null,
    `<b>Qty:</b> ${qty} ${escapeHtml(product?.unit || 'units')}`,
    `<b>Total Value:</b> ${formatCurrencyUsd(totalPrice)} / ${formatCurrencyKhr(totalPrice)}${isDamaged ? ' (🚨 Damaged)' : ''}`,
    `<b>Date:</b> ${formatDateTime(movement.createdAt)}`,
  ].filter(Boolean).join('\n');
}

export function formatSaleNotificationCaption(receipt: ReceiptData): string {
  const itemsFormatted = receipt.items
    .map(
      (i) =>
        `• <b>${i.quantity} ${i.unit || i.product.unit || 'pcs'}</b> of ${escapeHtml(i.product.name)} = <b>${formatCurrencyUsd(i.quantity * i.unitPrice)}</b>`,
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

export interface DailySalesSummary {
  totalSales: number;
  totalOrders: number;
  totalItemsSold: number;
  date: string;
}

export function formatDailySalesSummaryMessage(summary: DailySalesSummary): string {
  const hasNoSales = summary.totalOrders === 0;
  return [
    `📊 <b>Daily Sales Report — ${escapeHtml(summary.date)}</b>`,
    '━━━━━━━━━━━━━━━━━━━━━━━━',
    hasNoSales
      ? '😶 No sales recorded today.'
      : [
          `💰 <b>Total Revenue:</b> ${formatCurrencyUsd(summary.totalSales)} / ${formatCurrencyKhr(summary.totalSales)}`,
          `🛒 <b>Total Orders:</b> ${summary.totalOrders}`,
          `📦 <b>Items Sold:</b> ${summary.totalItemsSold}`,
        ].join('\n'),
    '━━━━━━━━━━━━━━━━━━━━━━━━',
    '<i>Auto-generated end-of-day report 🤖</i>',
  ].join('\n');
}

export function formatProductDeletedMessage(product: Product): string {
  return [
    `🗑️ <b>Product Deleted</b>`,
    `<b>Name:</b> ${escapeHtml(product.name)}`,
    product.barcode ? `<b>Barcode:</b> <code>${escapeHtml(product.barcode)}</code>` : null,
    `<b>Category:</b> ${escapeHtml(product.category)}`,
    `<b>Last Stock:</b> <code>${product.quantity} ${escapeHtml(product.unit)}</code>`,
    `<b>Sell Price:</b> ${formatCurrencyUsd(product.sellPrice)} / ${formatCurrencyKhr(product.sellPrice)}`,
    `<b>Deleted At:</b> ${formatDateTime(new Date().toISOString())}`,
  ].filter(Boolean).join('\n');
}

export interface AuthEventInfo {
  email: string;
  role?: string;
  fullName?: string | null;
}

export function formatUserLoginMessage(info: AuthEventInfo): string {
  return [
    `🔓 <b>User Logged In</b>`,
    `<b>Email:</b> ${escapeHtml(info.email)}`,
    info.fullName ? `<b>Name:</b> ${escapeHtml(info.fullName)}` : null,
    info.role ? `<b>Role:</b> ${escapeHtml(info.role)}` : null,
    `<b>Time:</b> ${formatDateTime(new Date().toISOString())}`,
  ].filter(Boolean).join('\n');
}

export function formatUserLogoutMessage(info: AuthEventInfo): string {
  return [
    `🔒 <b>User Logged Out</b>`,
    `<b>Email:</b> ${escapeHtml(info.email)}`,
    info.fullName ? `<b>Name:</b> ${escapeHtml(info.fullName)}` : null,
    info.role ? `<b>Role:</b> ${escapeHtml(info.role)}` : null,
    `<b>Time:</b> ${formatDateTime(new Date().toISOString())}`,
  ].filter(Boolean).join('\n');
}


