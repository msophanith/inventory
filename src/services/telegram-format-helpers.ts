import { formatDateTime } from '@/utils/date';
import { formatCurrencyKhr, formatCurrencyUsd } from '@/utils/currency';

export const TELEGRAM_DIVIDER = '───';

export function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function formatDualCurrency(amount: number): string {
  return `<b>${formatCurrencyUsd(amount)}</b> · ${formatCurrencyKhr(amount)}`;
}

export function formatDualCurrencyTotal(amount: number): string {
  return `<b>${formatCurrencyUsd(amount)} · ${formatCurrencyKhr(amount)}</b>`;
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
  const roleBadge = info.role ? ` · ${info.role.toUpperCase()}` : '';
  const name = info.fullName || info.email.split('@')[0];

  return [
    `🟢 <b>Operator Signed In</b> · <b>${escapeHtml(name)}</b>`,
    '',
    `<blockquote>👤 <b>User:</b> ${escapeHtml(info.fullName || info.email)}${roleBadge}`,
    `📧 <b>Account:</b> ${escapeHtml(info.email)}`,
    `⏰ <b>Time:</b> ${formatTimestamp()}</blockquote>`,
  ].join('\n');
}

export function formatUserLogoutMessage(info: AuthEventInfo): string {
  const name = info.fullName || info.email.split('@')[0];

  return [
    `⚪ <b>Operator Signed Out</b> · <b>${escapeHtml(name)}</b>`,
    '',
    `<blockquote>👤 <b>User:</b> ${escapeHtml(info.fullName || info.email)}`,
    `📧 <b>Account:</b> ${escapeHtml(info.email)}`,
    `⏰ <b>Time:</b> ${formatTimestamp()}</blockquote>`,
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

  return [
    '🗑️ <b>Product Deleted from Catalog</b>',
    `<b>${escapeHtml(product.name)}</b>`,
    product.barcode ? `Barcode: <code>${escapeHtml(product.barcode)}</code>` : null,
    '',
    `<blockquote>Category: ${escapeHtml(product.category || 'General')}`,
    `Final Stock: ${product.quantity} ${escapeHtml(unit)}`,
    `Last Price: ${formatDualCurrency(product.sellPrice)}`,
    `Time: ${formatTimestamp()}</blockquote>`,
  ].filter(Boolean).join('\n');
}
