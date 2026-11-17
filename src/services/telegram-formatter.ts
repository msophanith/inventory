import type { ReceiptData } from '@/features/sell/types/sell.types';
import { formatCurrencyUsd } from '@/utils/currency';
import type { Movement } from './movement';
import type { Product } from './product';
import {
  TELEGRAM_DIVIDER,
  escapeHtml,
  formatDualCurrency,
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
  const itemsText = receipt.items
    .map((i) => {
      const lineTotal = i.quantity * i.unitPrice;
      const unit = i.unit || i.product.unit || 'pcs';
      return `• ${i.quantity} ${escapeHtml(unit)} of ${escapeHtml(i.product.name)} = ${formatCurrencyUsd(lineTotal)}`;
    })
    .join('\n');

  const discountLine = receipt.discount > 0
    ? `\nDiscount: -${formatDualCurrency(receipt.discount)}`
    : '';

  const cleanOrderId = receipt.orderId.startsWith('#') ? receipt.orderId : `#${receipt.orderId}`;
  const cashier = receipt.soldBy || 'Admin';
  const payment = receipt.paymentMethod.toUpperCase();

  return [
    `🛍️ <b>Sale Completed (${escapeHtml(cleanOrderId)})</b>`,
    TELEGRAM_DIVIDER,
    itemsText,
    TELEGRAM_DIVIDER,
    `<b>Grand Total:</b> ${formatDualCurrency(receipt.total)}${discountLine}`,
    `Payment: ${escapeHtml(payment)}`,
    `Cashier: ${escapeHtml(cashier)}`,
    `Date: ${formatTimestamp(receipt.createdAt)}`,
    '📄 <i>PDF Invoice Attached Below</i>',
  ].join('\n');
}

export function formatMovementNotificationMessage(
  movement: Movement,
  product?: Product | null,
): string {
  const isDamaged = Boolean(movement.isDamaged || movement.reference?.toLowerCase().includes('damage'));
  const header = movement.type === 'IN'
    ? '📥 <b>Stock Restocked (IN)</b>'
    : movement.type === 'OUT'
      ? (isDamaged ? '⚠️ <b>Damaged Stock Removed (OUT)</b>' : '📤 <b>Stock Dispatched (OUT)</b>')
      : (isDamaged ? '⚠️ <b>Customer Return (Damaged)</b>' : '🔄 <b>Customer Return (IN)</b>');

  const name = product?.name || movement.product?.name || `Product #${movement.productId}`;
  const barcode = product?.barcode || movement.product?.barcode;
  const qty = Math.abs(movement.quantity || 0);
  const unit = product?.unit || movement.product?.unit || 'units';
  const unitPrice = movement.unitPrice ?? product?.sellPrice ?? 0;
  const totalPrice = qty * unitPrice;
  const sign = movement.type === 'IN' || movement.type === 'RETURN' ? '+' : '-';
  const barcodeLine = barcode ? `\n• Barcode: ${escapeHtml(barcode)}` : '';
  const noteLine = movement.note ? `\n• Note: ${escapeHtml(movement.note)}` : '';

  return [
    header,
    TELEGRAM_DIVIDER,
    `• Product: ${escapeHtml(name)}${barcodeLine}`,
    `• Quantity: ${sign}${qty} ${escapeHtml(unit)}`,
    `• Total Value: ${formatDualCurrency(totalPrice)}${isDamaged ? ' (Loss Write-Off)' : ''}`,
    `• Reason: ${escapeHtml(movement.reference || 'Manual Entry')}${noteLine}`,
    TELEGRAM_DIVIDER,
    `Date: ${formatTimestamp(movement.createdAt)}`,
  ].join('\n');
}

export function formatLowStockAlertMessage(product: Product): string {
  const isOut = product.quantity <= 0;
  const unit = product.unit || 'units';
  const barcodeLine = product.barcode ? `\n• Barcode: ${escapeHtml(product.barcode)}` : '';

  return [
    isOut ? '🚨 <b>Out of Stock Alert</b>' : '⚠️ <b>Low Stock Alert</b>',
    TELEGRAM_DIVIDER,
    `• Product: ${escapeHtml(product.name)}`,
    `• Category: ${escapeHtml(product.category || 'General')}${barcodeLine}`,
    `• Stock Level: ${product.quantity} / ${product.minStock || 0} ${escapeHtml(unit)}`,
    `• Status: ${isOut ? 'Completely Depleted' : 'Running Low'}`,
    TELEGRAM_DIVIDER,
    `Date: ${formatTimestamp()}`,
    '💡 <i>Please restock this item soon</i>',
  ].join('\n');
}

export function formatDailySalesSummaryMessage(summary: DailySalesSummary): string {
  const hasNoSales = summary.totalOrders === 0;
  const avgOrder = summary.totalOrders > 0 ? summary.totalSales / summary.totalOrders : 0;

  return [
    '📊 <b>Daily Sales Summary</b>',
    TELEGRAM_DIVIDER,
    `Date: ${escapeHtml(summary.date)}`,
    hasNoSales
      ? 'No sales transactions recorded today.'
      : [
          `Grand Total: ${formatDualCurrency(summary.totalSales)}`,
          `Completed Orders: ${summary.totalOrders} sales`,
          `Items Sold: ${summary.totalItemsSold} units`,
          `Average / Order: ${formatDualCurrency(avgOrder)}`,
        ].join('\n'),
    TELEGRAM_DIVIDER,
    '<i>MeanLeap POS • Closing Report</i>',
  ].join('\n');
}
