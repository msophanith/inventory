import type { ReceiptData } from '../features/sell/types/sell.types';
import { generatePdfInvoiceBlob } from '../features/sell/utils/pdf-generator';
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
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export class TelegramService {
  private get botToken(): string {
    return import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
  }

  private get chatId(): string {
    return import.meta.env.VITE_TELEGRAM_CHAT_ID || '';
  }

  private async sendMessage(text: string): Promise<boolean> {
    if (!this.botToken || !this.chatId) return false;

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
      return response.ok;
    } catch (err) {
      console.error('[TelegramService] Error sending text:', err);
      return false;
    }
  }

  /**
   * Upload PDF document to Telegram using sendDocument API
   */
  async sendDocument(
    fileBlob: Blob,
    fileName: string,
    caption?: string,
  ): Promise<boolean> {
    if (!this.botToken || !this.chatId) return false;

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendDocument`;
      const formData = new FormData();
      formData.append('chat_id', this.chatId);
      formData.append('document', fileBlob, fileName);
      if (caption) {
        formData.append('caption', caption);
        formData.append('parse_mode', 'HTML');
      }

      const response = await fetch(url, { method: 'POST', body: formData });
      return response.ok;
    } catch (err) {
      console.error('[TelegramService] Error uploading PDF invoice:', err);
      return false;
    }
  }

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

    const productName =
      product?.name ||
      movement.product?.name ||
      `Product #${movement.productId}`;
    const qty = Math.abs(movement.quantity || 0);
    const unitPrice = movement.unitPrice ?? product?.sellPrice ?? 0;
    const dateFormatted = formatDateTime(movement.createdAt);

    const message = [
      `${typeEmoji} <b>Stock Movement (${escapeHtml(movement.type)})</b>`,
      `<b>Product:</b> ${escapeHtml(productName)}`,
      `<b>Quantity:</b> ${qty} ${escapeHtml(product?.unit || 'units')}`,
      `<b>Total:</b> ${formatCurrency(qty * unitPrice)}${isDamaged ? ' (🚨 Damaged)' : ''}`,
      `<b>Date:</b> ${dateFormatted}`,
    ].join('\n');

    return this.sendMessage(message);
  }

  /**
   * Generate & attach PDF Invoice when POS sale completes
   */
  async sendSaleNotification(receipt: ReceiptData): Promise<boolean> {
    const dateFormatted = formatDateTime(receipt.createdAt);

    const itemsFormatted = receipt.items
      .map(
        (i) =>
          `• <b>${i.quantity}x</b> ${escapeHtml(i.product.name)} = <b>${formatCurrency(i.quantity * i.unitPrice)}</b>`,
      )
      .join('\n');

    const caption = [
      `🛍️ <b>Sale Completed (#${escapeHtml(receipt.orderId)})</b>`,
      '----------------------------------',
      itemsFormatted,
      '----------------------------------',
      `<b>Grand Total:</b> ${formatCurrency(receipt.total)} (${escapeHtml(receipt.paymentMethod.toUpperCase())})`,
      `<b>Date:</b> ${dateFormatted}`,
      '📄 <i>PDF Invoice Attached Below</i>',
    ].join('\n');

    try {
      const pdfBlob = generatePdfInvoiceBlob(receipt);
      const fileName = `Invoice_${receipt.orderId}.pdf`;
      const sent = await this.sendDocument(pdfBlob, fileName, caption);
      if (sent) return true;
    } catch (err) {
      console.error(
        '[TelegramService] PDF attachment error, falling back to message:',
        err,
      );
    }

    return this.sendMessage(caption);
  }
}

export const telegramService = new TelegramService();
