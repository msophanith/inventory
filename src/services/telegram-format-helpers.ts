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
  const roleLine = info.role ? `\n• <b>Access Role:</b> ${escapeHtml(info.role.toUpperCase())}` : '';
  const name = info.fullName || info.email.split('@')[0];

  return [
    `🟢 <b>OPERATOR LOGIN</b> • <b>${escapeHtml(name)}</b>`,
    '',
    '<blockquote>👤 <b>USER ACCOUNT</b>',
    `• <b>Operator:</b> ${escapeHtml(info.fullName || info.email)}${roleLine}`,
    `• <b>Email:</b> ${escapeHtml(info.email)}</blockquote>`,
    '',
    '<blockquote>🛡️ <b>SESSION AUDIT</b>',
    '• <b>Event:</b> Terminal Access Granted',
    `• <b>Timestamp:</b> ${formatTimestamp()}</blockquote>`,
  ].join('\n');
}

export function formatUserLogoutMessage(info: AuthEventInfo): string {
  const name = info.fullName || info.email.split('@')[0];

  return [
    `⚪ <b>OPERATOR LOGOUT</b> • <b>${escapeHtml(name)}</b>`,
    '',
    '<blockquote>👤 <b>USER ACCOUNT</b>',
    `• <b>Operator:</b> ${escapeHtml(info.fullName || info.email)}`,
    `• <b>Email:</b> ${escapeHtml(info.email)}</blockquote>`,
    '',
    '<blockquote>🔒 <b>SESSION AUDIT</b>',
    '• <b>Event:</b> Terminal Access Closed',
    `• <b>Timestamp:</b> ${formatTimestamp()}</blockquote>`,
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
  const barcodeLine = product.barcode ? `\n• <b>Barcode:</b> <code>${escapeHtml(product.barcode)}</code>` : '';

  return [
    '🗑️ <b>PRODUCT CATALOG AUDIT</b>',
    '',
    '<blockquote>📦 <b>REMOVED PRODUCT</b>',
    `• <b>Name:</b> ${escapeHtml(product.name)}`,
    `• <b>Category:</b> ${escapeHtml(product.category || 'General')}${barcodeLine}</blockquote>`,
    '',
    '<blockquote>📉 <b>FINAL DISPOSITION</b>',
    `• <b>Final Stock:</b> ${product.quantity} ${escapeHtml(unit)}`,
    `• <b>Last Price:</b> ${formatDualCurrency(product.sellPrice)}`,
    `• <b>Timestamp:</b> ${formatTimestamp()}</blockquote>`,
  ].join('\n');
}
