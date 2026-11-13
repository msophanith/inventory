import type { ReceiptData } from '@/features/sell/types/sell.types';
import type { Movement } from './movement';
import type { Product } from './product';
import {
  escapeHtml,
  formatDualCurrency,
  formatDualCurrencyTotal,
  formatProductDeletedMessage,
  formatTimestamp,
  formatUserLoginMessage,
  formatUserLogoutMessage,
  type AuthEventInfo,
  type DailySalesSummary,
} from './telegram-format-helpers';

export {
  escapeHtml,
  formatProductDeletedMessage,
  formatUserLoginMessage,
  formatUserLogoutMessage,
  type AuthEventInfo,
  type DailySalesSummary,
};

export function formatMovementNotificationMessage(
  movement: Movement,
  product?: Product | null,
): string {
  const isDamaged = Boolean(
    movement.isDamaged || movement.reference?.toLowerCase().includes('damage'),
  );

  let title = '📦 <b>Stock Movement</b>';
  if (movement.type === 'IN') title = '📥 <b>Stock In · Restocked</b>';
  else if (movement.type === 'OUT') {
    title = isDamaged
      ? '⚠️ <b>Damaged Stock Removed</b>'
      : '📤 <b>Stock Out · Dispatched</b>';
  } else if (movement.type === 'RETURN') {
    title = isDamaged
      ? '⚠️ <b>Customer Return (Damaged)</b>'
      : '🔄 <b>Customer Return</b>';
  }

  const name =
    product?.name || movement.product?.name || `Product #${movement.productId}`;
  const barcode = product?.barcode || movement.product?.barcode;
  const qty = Math.abs(movement.quantity || 0);
  const unit = product?.unit || movement.product?.unit || 'units';
  const unitPrice = movement.unitPrice ?? product?.sellPrice ?? 0;
  const totalPrice = qty * unitPrice;
  const sign = movement.type === 'IN' || movement.type === 'RETURN' ? '+' : '-';

  return [
    `${title} · <b>${escapeHtml(name)}</b>`,
    barcode ? `Barcode: <code>${escapeHtml(barcode)}</code>` : null,
    '',
    `<blockquote><b>Quantity:</b> <b>${sign}${qty} ${escapeHtml(unit)}</b>`,
    `<b>Total Value:</b> ${formatDualCurrency(totalPrice)}${isDamaged ? ' (Write-Off)' : ''}`,
    movement.reference ? `Ref: ${escapeHtml(movement.reference)}` : null,
    movement.note ? `Note: ${escapeHtml(movement.note)}` : null,
    `Time: ${formatTimestamp(movement.createdAt)}</blockquote>`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function formatSaleNotificationCaption(receipt: ReceiptData): string {
  const itemCount = receipt.items.reduce((sum, i) => sum + i.quantity, 0);
  const itemsText = receipt.items
    .map((i) => {
      const lineTotal = i.quantity * i.unitPrice;
      const unit = i.unit || i.product.unit || 'pcs';
      return `• ${i.quantity}× <b>${escapeHtml(i.product.name)}</b> (${escapeHtml(unit)}) — ${formatDualCurrency(lineTotal)}`;
    })
    .join('\n');

  const discountBadge =
    receipt.discount > 0
      ? `\n🏷️ Discount applied: -${formatDualCurrency(receipt.discount)}`
      : '';

  const cashier = receipt.soldBy || 'Admin';
  const payment = receipt.paymentMethod.toUpperCase();

  return [
    `🧾 <b>Sale Completed</b> · <code>#${escapeHtml(receipt.orderId)}</code>`,
    '',
    `💰 <b>Total Paid:</b> ${formatDualCurrencyTotal(receipt.total)}`,
    `💳 ${escapeHtml(payment)} · 👤 ${escapeHtml(cashier)} · ⏰ ${formatTimestamp(receipt.createdAt)}`,
    discountBadge,
    '',
    `<blockquote><b>Purchased Items (${itemCount}):</b>\n${itemsText}</blockquote>`,
    '',
    '📄 <i>Tax invoice PDF attached</i>',
  ]
    .filter(Boolean)
    .join('\n');
}

export function formatLowStockAlertMessage(product: Product): string {
  const isOut = product.quantity <= 0;
  const header = isOut
    ? '🔴 <b>Out of Stock Alert</b>'
    : '🟡 <b>Low Stock Warning</b>';

  const unit = product.unit || 'units';
  const stockText = isOut
    ? `<b>0 ${escapeHtml(unit)} remaining</b> (Min threshold: ${product.minStock || 0})`
    : `<b>${product.quantity} ${escapeHtml(unit)} left</b> (Min threshold: ${product.minStock || 0})`;

  return [
    `${header} · <b>${escapeHtml(product.name)}</b>`,
    product.category ? `Category: ${escapeHtml(product.category)}` : null,
    product.barcode
      ? `Barcode: <code>${escapeHtml(product.barcode)}</code>`
      : null,
    '',
    `<blockquote>📊 <b>Stock Level:</b> ${stockText}`,
    `⚡ <b>Status:</b> ${isOut ? 'Depleted · Action Required' : 'Running Low · Needs Restock'}</blockquote>`,
    '',
    '💡 <i>Tap below to open Restock in Movement</i>',
  ]
    .filter(Boolean)
    .join('\n');
}

export function formatDailySalesSummaryMessage(
  summary: DailySalesSummary,
): string {
  const hasNoSales = summary.totalOrders === 0;

  return [
    '📊 <b>Daily Sales Summary</b>',
    `📅 ${escapeHtml(summary.date)}`,
    '',
    hasNoSales
      ? '<blockquote>No sales transactions were recorded today.</blockquote>'
      : [
          '<blockquote>💰 <b>Total Revenue:</b>',
          formatDualCurrencyTotal(summary.totalSales),
          '',
          `🛒 <b>Completed Orders:</b> ${summary.totalOrders} sales`,
          `📦 <b>Products Sold:</b> ${summary.totalItemsSold} units</blockquote>`,
        ].join('\n'),
    '',
    '🤖 <i>MeanLeap POS · Automated Closing Summary</i>',
  ]
    .filter(Boolean)
    .join('\n');
}
