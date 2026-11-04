import type { ReceiptData } from '@/features/sell/types/sell.types';
import type { Movement } from './movement';
import type { Product } from './product';
import {
  TELEGRAM_DIVIDER,
  escapeHtml,
  formatDualCurrency,
  formatDualCurrencyTotal,
  formatTimestamp,
  formatUserLoginMessage,
  formatUserLogoutMessage,
  type AuthEventInfo,
  type DailySalesSummary,
} from './telegram-format-helpers';

export {
  escapeHtml,
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
    movement.isDamaged || movement.reference?.toLowerCase() === 'damage',
  );
  let badge = '📦 <b>INVENTORY AUDIT</b>';
  if (movement.type === 'IN') badge = '📥 <b>STOCK RESTOCKED (IN)</b>';
  else if (movement.type === 'OUT') badge = isDamaged ? '⚠️ <b>DAMAGED WRITE-OFF (OUT)</b>' : '📤 <b>STOCK ISSUED (OUT)</b>';
  else if (movement.type === 'RETURN') badge = '🔄 <b>CUSTOMER RETURN (IN)</b>';

  const name = product?.name || movement.product?.name || `Product #${movement.productId}`;
  const barcode = product?.barcode || movement.product?.barcode;
  const qty = Math.abs(movement.quantity || 0);
  const unit = product?.unit || movement.product?.unit || 'units';
  const unitPrice = movement.unitPrice ?? product?.sellPrice ?? 0;
  const totalPrice = qty * unitPrice;

  return [
    badge,
    TELEGRAM_DIVIDER,
    `📦 <b>Product:</b> <b>${escapeHtml(name)}</b>`,
    barcode ? `🔖 <b>Barcode:</b> <code>${escapeHtml(barcode)}</code>` : null,
    `<blockquote>🔢 <b>Quantity:</b> <code>${movement.type === 'IN' || movement.type === 'RETURN' ? '+' : '-'}${qty} ${escapeHtml(unit)}</code>`,
    `💵 <b>Total Value:</b> ${formatDualCurrency(totalPrice)}${isDamaged ? ' • 🚨 <b>Damaged</b>' : ''}`,
    movement.reference ? `🔖 <b>Ref:</b> <code>${escapeHtml(movement.reference)}</code>` : null,
    movement.note ? `📝 <b>Note:</b> ${escapeHtml(movement.note)}` : null,
    `⏰ <b>Date:</b> <code>${formatTimestamp(movement.createdAt)}</code></blockquote>`,
  ].filter(Boolean).join('\n');
}

export function formatSaleNotificationCaption(receipt: ReceiptData): string {
  const itemsFormatted = receipt.items
    .map((i) => {
      const lineTotal = i.quantity * i.unitPrice;
      const unit = i.unit || i.product.unit || 'pcs';
      return `▫️ <b>${i.quantity}× ${escapeHtml(i.product.name)}</b> (${escapeHtml(unit)})\n   └ ${formatDualCurrency(lineTotal)}`;
    })
    .join('\n');

  const discountLine = receipt.discount > 0
    ? `\n🏷️ <b>Discount:</b> -${formatDualCurrency(receipt.discount)}`
    : '';

  return [
    `🛍️ <b>POS TERMINAL</b> • <code>#${escapeHtml(receipt.orderId)}</code>`,
    TELEGRAM_DIVIDER,
    '<b>ORDER ITEMS:</b>',
    itemsFormatted,
    TELEGRAM_DIVIDER,
    `<blockquote>💵 <b>GRAND TOTAL:</b> ${formatDualCurrencyTotal(receipt.total)}${discountLine}`,
    `💳 <b>Payment:</b> <code>${escapeHtml(receipt.paymentMethod.toUpperCase())}</code>`,
    `👤 <b>Cashier:</b> <code>${escapeHtml(receipt.soldBy || 'Admin')}</code>`,
    `⏰ <b>Date:</b> <code>${formatTimestamp(receipt.createdAt)}</code></blockquote>`,
    '📄 <i>Tax invoice attached below</i>',
  ].join('\n');
}

export function formatLowStockAlertMessage(product: Product): string {
  const isOut = product.quantity <= 0;
  const header = isOut
    ? '🚨 <b>CRITICAL: OUT OF STOCK ALERT</b>'
    : '⚠️ <b>WARNING: LOW STOCK ALERT</b>';
  const statusBadge = isOut
    ? '🔴 <b>COMPLETELY DEPLETED</b>'
    : '🟡 <b>RUNNING CRITICALLY LOW</b>';

  return [
    header,
    TELEGRAM_DIVIDER,
    `📦 <b>Product:</b> <b>${escapeHtml(product.name)}</b>`,
    `🏷️ <b>Category:</b> <code>${escapeHtml(product.category || 'General')}</code>`,
    product.barcode ? `🔖 <b>Barcode:</b> <code>${escapeHtml(product.barcode)}</code>` : null,
    '',
    `<blockquote>📊 <b>Stock Level:</b> <code>${product.quantity} / ${product.minStock || 0} ${escapeHtml(product.unit || 'units')}</code>`,
    `⚡ <b>Status:</b> ${statusBadge}</blockquote>`,
    TELEGRAM_DIVIDER,
    '<i>⚡ Please restock this item promptly to maintain sales velocity.</i>',
  ].filter(Boolean).join('\n');
}

export function formatDailySalesSummaryMessage(summary: DailySalesSummary): string {
  const hasNoSales = summary.totalOrders === 0;

  return [
    '📊 <b>DAILY EXECUTIVE REPORT</b>',
    `📅 <code>${escapeHtml(summary.date)}</code>`,
    TELEGRAM_DIVIDER,
    hasNoSales
      ? '<blockquote>😶 <b>No sales transactions recorded today.</b></blockquote>'
      : [
          '<blockquote>💰 <b>TOTAL REVENUE:</b>',
          formatDualCurrencyTotal(summary.totalSales),
          '',
          `🛒 <b>Total Orders:</b> <code>${summary.totalOrders} sales</code>`,
          `📦 <b>Items Sold:</b> <code>${summary.totalItemsSold} units</code></blockquote>`,
        ].join('\n'),
    TELEGRAM_DIVIDER,
    '🤖 <i>Mean Leap POS • Automated Closing Report</i>',
  ].join('\n');
}

export function formatProductDeletedMessage(product: Product): string {
  return [
    '🗑️ <b>CATALOG AUDIT • PRODUCT REMOVED</b>',
    TELEGRAM_DIVIDER,
    `📦 <b>Product:</b> <b>${escapeHtml(product.name)}</b>`,
    `🏷️ <b>Category:</b> <code>${escapeHtml(product.category || 'General')}</code>`,
    product.barcode ? `🔖 <b>Barcode:</b> <code>${escapeHtml(product.barcode)}</code>` : null,
    '',
    `<blockquote>📉 <b>Final Stock:</b> <code>${product.quantity} ${escapeHtml(product.unit || 'units')}</code>`,
    `💵 <b>Last Sell Price:</b> ${formatDualCurrency(product.sellPrice)}</blockquote>`,
    TELEGRAM_DIVIDER,
    `⏰ <b>Deleted At:</b> <code>${formatTimestamp()}</code>`,
  ].filter(Boolean).join('\n');
}
