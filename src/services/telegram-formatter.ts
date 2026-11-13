import type { ReceiptData } from '@/features/sell/types/sell.types';
import { formatCurrencyUsd } from '@/utils/currency';
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

export function formatSaleNotificationCaption(receipt: ReceiptData): string {
  const itemCount = receipt.items.reduce((sum, i) => sum + i.quantity, 0);
  const itemsText = receipt.items
    .map((i, idx) => {
      const lineTotal = i.quantity * i.unitPrice;
      const unit = i.unit || i.product.unit || 'pcs';
      return `${idx + 1}. <b>${escapeHtml(i.product.name)}</b> (${escapeHtml(unit)})\n   └ ${i.quantity} × ${formatCurrencyUsd(i.unitPrice)} ➔ ${formatDualCurrency(lineTotal)}`;
    })
    .join('\n');

  const discountLine = receipt.discount > 0 ? `\n• <b>Discount:</b> -${formatDualCurrency(receipt.discount)}` : '';
  const cashier = receipt.soldBy || 'Admin';
  const payment = receipt.paymentMethod.toUpperCase();
  const quoteTag = receipt.items.length > 3 ? '<blockquote expandable>' : '<blockquote>';

  return [
    `🧾 <b>SALE RECEIPT</b> • <code>#${escapeHtml(receipt.orderId)}</code>`,
    '',
    '<blockquote>💳 <b>PAYMENT SUMMARY</b>',
    `• <b>Total Paid:</b> ${formatDualCurrencyTotal(receipt.total)}`,
    `• <b>Method:</b> ${escapeHtml(payment)}${discountLine}</blockquote>`,
    '',
    `${quoteTag}🛍️ <b>ORDER ITEMS (${itemCount})</b>\n${itemsText}</blockquote>`,
    '',
    '<blockquote>ℹ️ <b>TRANSACTION INFO</b>',
    `• <b>Cashier:</b> ${escapeHtml(cashier)}`,
    `• <b>Date:</b> ${formatTimestamp(receipt.createdAt)}`,
    '• <b>Invoice:</b> <i>Tax invoice PDF attached below</i></blockquote>',
  ].join('\n');
}

export function formatMovementNotificationMessage(
  movement: Movement,
  product?: Product | null,
): string {
  const isDamaged = Boolean(movement.isDamaged || movement.reference?.toLowerCase().includes('damage'));
  const header = movement.type === 'IN'
    ? '📥 <b>STOCK RESTOCKED (IN)</b>'
    : movement.type === 'OUT'
      ? (isDamaged ? '⚠️ <b>DAMAGED STOCK REMOVED (OUT)</b>' : '📤 <b>STOCK DISPATCHED (OUT)</b>')
      : (isDamaged ? '⚠️ <b>CUSTOMER RETURN (DAMAGED)</b>' : '🔄 <b>CUSTOMER RETURN (IN)</b>');

  const name = product?.name || movement.product?.name || `Product #${movement.productId}`;
  const barcode = product?.barcode || movement.product?.barcode;
  const category = product?.category || movement.product?.category;
  const qty = Math.abs(movement.quantity || 0);
  const unit = product?.unit || movement.product?.unit || 'units';
  const unitPrice = movement.unitPrice ?? product?.sellPrice ?? 0;
  const totalPrice = qty * unitPrice;
  const sign = movement.type === 'IN' || movement.type === 'RETURN' ? '+' : '-';
  const barcodeLine = barcode ? `\n• <b>Barcode:</b> <code>${escapeHtml(barcode)}</code>` : '';
  const noteLine = movement.note ? `\n• <b>Note:</b> ${escapeHtml(movement.note)}` : '';

  return [
    header,
    '',
    '<blockquote>📦 <b>PRODUCT IDENTIFICATION</b>',
    `• <b>Item:</b> ${escapeHtml(name)}`,
    `• <b>Category:</b> ${escapeHtml(category || 'General')}${barcodeLine}</blockquote>`,
    '',
    '<blockquote>📊 <b>QUANTITY & VALUATION</b>',
    `• <b>Quantity:</b> <b>${sign}${qty} ${escapeHtml(unit)}</b>`,
    `• <b>Total Value:</b> ${formatDualCurrency(totalPrice)}${isDamaged ? ' <i>(Loss Write-Off)</i>' : ''}</blockquote>`,
    '',
    '<blockquote>📝 <b>AUDIT TRAIL</b>',
    `• <b>Reason:</b> ${escapeHtml(movement.reference || 'Manual Entry')}${noteLine}`,
    `• <b>Timestamp:</b> ${formatTimestamp(movement.createdAt)}</blockquote>`,
  ].join('\n');
}

export function formatLowStockAlertMessage(product: Product): string {
  const isOut = product.quantity <= 0;
  const unit = product.unit || 'units';
  const barcodeLine = product.barcode ? `\n• <b>Barcode:</b> <code>${escapeHtml(product.barcode)}</code>` : '';

  return [
    isOut ? '🚨 <b>OUT OF STOCK ALERT</b>' : '⚠️ <b>LOW STOCK WARNING</b>',
    '',
    '<blockquote>📦 <b>PRODUCT DETAILS</b>',
    `• <b>Item:</b> ${escapeHtml(product.name)}`,
    `• <b>Category:</b> ${escapeHtml(product.category || 'General')}${barcodeLine}</blockquote>`,
    '',
    '<blockquote>📉 <b>STOCK STATUS</b>',
    `• <b>Current Stock:</b> <b>${product.quantity} ${escapeHtml(unit)}</b>`,
    `• <b>Min Threshold:</b> ${product.minStock || 0} ${escapeHtml(unit)}`,
    `• <b>Condition:</b> ${isOut ? '🔴 Completely Depleted' : '🟡 Running Critically Low'}</blockquote>`,
    '',
    '<blockquote>⚡ <b>ACTION REQUIRED</b>',
    '💡 <i>Restock immediately to maintain retail sales velocity.</i></blockquote>',
  ].join('\n');
}

export function formatDailySalesSummaryMessage(summary: DailySalesSummary): string {
  const hasNoSales = summary.totalOrders === 0;
  const avgOrder = summary.totalOrders > 0 ? summary.totalSales / summary.totalOrders : 0;

  return [
    '📊 <b>DAILY CLOSING REPORT</b>',
    `📅 ${escapeHtml(summary.date)}`,
    '',
    hasNoSales
      ? '<blockquote>😶 <b>No sales transactions recorded today.</b></blockquote>'
      : [
          '<blockquote>💰 <b>REVENUE OVERVIEW</b>',
          `• <b>Gross Sales:</b> ${formatDualCurrencyTotal(summary.totalSales)}</blockquote>`,
          '',
          '<blockquote>📈 <b>TRANSACTION METRICS</b>',
          `• <b>Completed Orders:</b> ${summary.totalOrders} sales`,
          `• <b>Products Sold:</b> ${summary.totalItemsSold} units`,
          `• <b>Avg / Order:</b> ${formatDualCurrency(avgOrder)}</blockquote>`,
        ].join('\n'),
    '',
    '🤖 <i>MeanLeap POS • Automated Daily Summary</i>',
  ].join('\n');
}
