import { formatDateTime } from '@/utils/date';
import { formatCurrencyKhr, formatCurrencyUsd } from '@/utils/currency';

export const TELEGRAM_DIVIDER = '━━━━━━━━━━━━━━━━━━━━━━';

export function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function formatDualCurrency(amount: number): string {
  return `<b>${formatCurrencyUsd(amount)}</b> (<code>${formatCurrencyKhr(amount)}</code>)`;
}

export function formatDualCurrencyTotal(amount: number): string {
  return `<b>${formatCurrencyUsd(amount)}</b> • <code>${formatCurrencyKhr(amount)}</code>`;
}

export function formatTimestamp(dateValue?: string | Date): string {
  if (dateValue instanceof Date) {
    return formatDateTime(dateValue.toISOString());
  }
  return formatDateTime(dateValue || new Date().toISOString());
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
  return [
    '🛡️ <b>SECURITY LOG • OPERATOR LOGIN</b>',
    TELEGRAM_DIVIDER,
    `👤 <b>Operator:</b> <b>${escapeHtml(info.fullName || info.email)}</b>`,
    info.role ? `🔑 <b>Access Role:</b> <code>${escapeHtml(info.role.toUpperCase())}</code>` : null,
    `📧 <b>Account:</b> <code>${escapeHtml(info.email)}</code>`,
    TELEGRAM_DIVIDER,
    `⏰ <b>Session Started:</b> <code>${formatTimestamp()}</code>`,
  ].filter(Boolean).join('\n');
}

export function formatUserLogoutMessage(info: AuthEventInfo): string {
  return [
    '🔒 <b>SECURITY LOG • OPERATOR LOGOUT</b>',
    TELEGRAM_DIVIDER,
    `👤 <b>Operator:</b> <b>${escapeHtml(info.fullName || info.email)}</b>`,
    info.role ? `🔑 <b>Access Role:</b> <code>${escapeHtml(info.role.toUpperCase())}</code>` : null,
    `📧 <b>Account:</b> <code>${escapeHtml(info.email)}</code>`,
    TELEGRAM_DIVIDER,
    `⏰ <b>Session Ended:</b> <code>${formatTimestamp()}</code>`,
  ].filter(Boolean).join('\n');
}
