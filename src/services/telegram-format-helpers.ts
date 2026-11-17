import { formatDateTime } from '@/utils/date';
import { formatCurrencyKhr, formatCurrencyUsd } from '@/utils/currency';

export const TELEGRAM_DIVIDER = '----------------------------------------';

export function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function formatDualCurrency(amount: number): string {
  return `${formatCurrencyUsd(amount)} (${formatCurrencyKhr(amount)})`;
}

export function formatTimestamp(dateValue?: string | Date): string {
  if (dateValue instanceof Date) {
    return formatDateTime(dateValue.toISOString(), 'DD MMM YYYY, HH:mm');
  }
  return formatDateTime(dateValue || new Date().toISOString(), 'DD MMM YYYY, HH:mm');
}

export interface DailySalesSummary {
  totalSales: number;
  totalOrders: number;
  totalItemsSold: number;
  date: string;
}

export interface AuthEventInfo {
  email: string;
  role?: string;
  fullName?: string | null;
}

export function formatUserLoginMessage(info: AuthEventInfo): string {
  const roleLine = info.role ? `\nAccess Role: ${escapeHtml(info.role.toUpperCase())}` : '';
  const name = info.fullName || info.email.split('@')[0];

  return [
    '🟢 <b>Operator Signed In</b>',
    TELEGRAM_DIVIDER,
    `Operator: ${escapeHtml(name)}${roleLine}`,
    `Email: ${escapeHtml(info.email)}`,
    `Date: ${formatTimestamp()}`,
  ].join('\n');
}

export function formatUserLogoutMessage(info: AuthEventInfo): string {
  const name = info.fullName || info.email.split('@')[0];

  return [
    '⚪ <b>Operator Signed Out</b>',
    TELEGRAM_DIVIDER,
    `Operator: ${escapeHtml(name)}`,
    `Email: ${escapeHtml(info.email)}`,
    `Date: ${formatTimestamp()}`,
  ].join('\n');
}

export function formatProductDeletedMessage(product: {
  name: string;
  category?: string;
  barcode?: string;
  quantity: number;
  unit?: string;
  sellPrice: number;
}): string {
  const unit = product.unit || 'units';
  const barcodeLine = product.barcode ? `\nBarcode: ${escapeHtml(product.barcode)}` : '';

  return [
    '🗑️ <b>Product Deleted from Catalog</b>',
    TELEGRAM_DIVIDER,
    `Product: ${escapeHtml(product.name)}`,
    `Category: ${escapeHtml(product.category || 'General')}${barcodeLine}`,
    `Final Stock: ${product.quantity} ${escapeHtml(unit)}`,
    `Last Price: ${formatDualCurrency(product.sellPrice)}`,
    TELEGRAM_DIVIDER,
    `Date: ${formatTimestamp()}`,
  ].join('\n');
}
