import type { ReceiptData } from '../features/sell/types/sell.types';
import type { Movement } from './movement';
import type { Product } from './product';
import { formatDateTime } from '../utils/date';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export class TelegramService {
  private get botToken(): string {
    return import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
  }

  private get chatId(): string {
    return import.meta.env.VITE_TELEGRAM_CHAT_ID || '';
  }

  /**
   * Helper to send HTML formatted message to Telegram Bot API
   */
  private async sendMessage(text: string): Promise<boolean> {
    if (!this.botToken || !this.chatId) {
      console.warn(
        '[TelegramService] VITE_TELEGRAM_BOT_TOKEN or VITE_TELEGRAM_CHAT_ID is missing in .env',
      );
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.chatId,
          text,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[TelegramService] Telegram API error:', errorText);
        return false;
      }

      return true;
    } catch (err) {
      console.error('[TelegramService] Failed to send Telegram notification:', err);
      return false;
    }
  }

  /**
   * Notify Telegram group for a single Stock Movement (IN, OUT, RETURN)
   */
  async sendMovementNotification(
    movement: Movement,
    product?: Product | null,
  ): Promise<boolean> {
    const isDamaged = Boolean(
      movement.isDamaged || movement.reference?.toLowerCase() === 'damage',
    );

    let typeEmoji = '📦';
    if (movement.type === 'IN') typeEmoji = '📥';
    else if (movement.type === 'OUT') typeEmoji = isDamaged ? '⚠️' : '📤';
    else if (movement.type === 'RETURN') typeEmoji = '🔄';

    const productName = product?.name || movement.product?.name || `Product #${movement.productId}`;
    const category = product?.category || movement.product?.category || 'General';
    const unitPrice = movement.unitPrice ?? product?.sellPrice ?? movement.product?.sellPrice ?? 0;
    const qty = Math.abs(movement.quantity || 0);
    const totalPrice = qty * unitPrice;
    const dateFormatted = formatDateTime(movement.createdAt);

    let conditionText = '';
    if (isDamaged) {
      conditionText = '\n<b>Condition:</b> 🚨 Damaged';
    }

    const message = [
      `${typeEmoji} <b>Stock Movement Alert (${escapeHtml(movement.type)})</b>`,
      '',
      `<b>Product:</b> ${escapeHtml(productName)}`,
      `<b>Category:</b> ${escapeHtml(category)}`,
      `<b>Quantity:</b> ${qty} ${escapeHtml(product?.unit || 'units')}`,
      `<b>Unit Price:</b> ${formatCurrency(unitPrice)}`,
      `<b>Total Value:</b> ${formatCurrency(totalPrice)}${conditionText}`,
      movement.note ? `<b>Note:</b> ${escapeHtml(movement.note)}` : '',
      movement.reference ? `<b>Ref:</b> ${escapeHtml(movement.reference)}` : '',
      `<b>Date:</b> ${dateFormatted}`,
    ]
      .filter(Boolean)
      .join('\n');

    return this.sendMessage(message);
  }

  /**
   * Notify Telegram group for a completed POS Sale receipt
   */
  async sendSaleNotification(receipt: ReceiptData): Promise<boolean> {
    const dateFormatted = formatDateTime(receipt.createdAt);

    const itemsFormatted = receipt.items
      .map((i) => {
        const lineTotal = i.quantity * i.unitPrice;
        return `• <b>${i.quantity}x</b> ${escapeHtml(i.product.name)} @ ${formatCurrency(i.unitPrice)} = <b>${formatCurrency(lineTotal)}</b>`;
      })
      .join('\n');

    const message = [
      `🛍️ <b>POS Sale Completed (#${escapeHtml(receipt.orderId)})</b>`,
      '----------------------------------',
      itemsFormatted,
      '----------------------------------',
      receipt.subtotal !== receipt.total ? `<b>Subtotal:</b> ${formatCurrency(receipt.subtotal)}` : '',
      receipt.discount > 0 ? `<b>Discount:</b> -${formatCurrency(receipt.discount)}` : '',
      receipt.tax > 0 ? `<b>Tax:</b> ${formatCurrency(receipt.tax)}` : '',
      `<b>Grand Total:</b> ${formatCurrency(receipt.total)}`,
      `<b>Payment Method:</b> ${escapeHtml(receipt.paymentMethod.toUpperCase())}`,
      `<b>Date:</b> ${dateFormatted}`,
    ]
      .filter(Boolean)
      .join('\n');

    return this.sendMessage(message);
  }
}

export const telegramService = new TelegramService();
