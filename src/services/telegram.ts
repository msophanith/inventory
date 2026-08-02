import type { ReceiptData } from '../features/sell/types/sell.types';
import { generatePdfInvoiceBlob } from '../features/sell/utils/pdf-generator';
import type { Movement } from './movement';
import type { Product } from './product';
import { formatDateTime } from '../utils/date';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

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
    if (!this.botToken || !this.chatId) {
      console.warn('[TelegramService] VITE_TELEGRAM_BOT_TOKEN or VITE_TELEGRAM_CHAT_ID missing in .env');
      return false;
    }
    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: this.chatId, text, parse_mode: 'HTML' }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('[TelegramService] sendMessage HTML failed:', errText);
        const fallbackResp = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: this.chatId, text: text.replace(/<[^>]*>/g, '') }),
        });
        return fallbackResp.ok;
      }
      return true;
    } catch (err) {
      console.error('[TelegramService] sendMessage error:', err);
      return false;
    }
  }

  async sendDocument(fileBlob: Blob, fileName: string, caption?: string): Promise<boolean> {
    if (!this.botToken || !this.chatId) {
      console.warn('[TelegramService] VITE_TELEGRAM_BOT_TOKEN or VITE_TELEGRAM_CHAT_ID missing in .env');
      return false;
    }
    try {
      const formData = new FormData();
      formData.append('chat_id', this.chatId);
      formData.append('document', fileBlob, fileName);
      if (caption) {
        formData.append('caption', caption);
        formData.append('parse_mode', 'HTML');
      }

      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendDocument`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('[TelegramService] sendDocument HTML failed:', errText);
        const fallbackForm = new FormData();
        fallbackForm.append('chat_id', this.chatId);
        fallbackForm.append('document', fileBlob, fileName);
        if (caption) fallbackForm.append('caption', caption.replace(/<[^>]*>/g, ''));

        const fallbackResp = await fetch(`https://api.telegram.org/bot${this.botToken}/sendDocument`, {
          method: 'POST',
          body: fallbackForm,
        });
        return fallbackResp.ok;
      }
      return true;
    } catch (err) {
      console.error('[TelegramService] sendDocument error:', err);
      return false;
    }
  }

  async sendMovementNotification(movement: Movement, product?: Product | null): Promise<boolean> {
    const isDamaged = Boolean(movement.isDamaged || movement.reference?.toLowerCase() === 'damage');
    let typeEmoji = '📦';
    if (movement.type === 'IN') typeEmoji = '📥';
    else if (movement.type === 'OUT') typeEmoji = isDamaged ? '⚠️' : '📤';
    else if (movement.type === 'RETURN') typeEmoji = '🔄';

    const name = product?.name || movement.product?.name || `Product #${movement.productId}`;
    const qty = Math.abs(movement.quantity || 0);
    const unitPrice = movement.unitPrice ?? product?.sellPrice ?? 0;

    const message = [
      `${typeEmoji} <b>Stock Movement (${escapeHtml(movement.type)})</b>`,
      `<b>Product:</b> ${escapeHtml(name)}`,
      `<b>Qty:</b> ${qty} ${escapeHtml(product?.unit || 'units')}`,
      `<b>Total Value:</b> ${formatCurrency(qty * unitPrice)}${isDamaged ? ' (🚨 Damaged)' : ''}`,
      `<b>Date:</b> ${formatDateTime(movement.createdAt)}`,
    ].join('\n');

    return this.sendMessage(message);
  }

  async sendSaleNotification(receipt: ReceiptData): Promise<boolean> {
    const itemsFormatted = receipt.items
      .map((i) => `• <b>${i.quantity}x</b> ${escapeHtml(i.product.name)} = <b>${formatCurrency(i.quantity * i.unitPrice)}</b>`)
      .join('\n');

    const caption = [
      `🛍️ <b>Sale Completed (#${escapeHtml(receipt.orderId)})</b>`,
      '----------------------------------',
      itemsFormatted,
      '----------------------------------',
      `<b>Grand Total:</b> ${formatCurrency(receipt.total)} (${escapeHtml(receipt.paymentMethod.toUpperCase())})`,
      `<b>Date:</b> ${formatDateTime(receipt.createdAt)}`,
      '📄 <i>PDF Invoice Attached Below</i>',
    ].join('\n');

    try {
      const pdfBlob = await generatePdfInvoiceBlob(receipt);
      const fileName = `Invoice_${receipt.orderId}.pdf`;
      const sent = await this.sendDocument(pdfBlob, fileName, caption);
      if (sent) return true;
    } catch (err) {
      console.error('[TelegramService] PDF invoice generation error:', err);
    }

    return this.sendMessage(caption);
  }

  async sendLowStockAlert(product: Product): Promise<boolean> {
    const isOut = product.quantity <= 0;
    const header = isOut ? '🚨 <b>CRITICAL: OUT OF STOCK ALERT</b>' : '⚠️ <b>WARNING: LOW STOCK ALERT</b>';
    const message = [
      header,
      `<b>Product:</b> ${escapeHtml(product.name)}`,
      `<b>Category:</b> ${escapeHtml(product.category)}`,
      `<b>Current Stock:</b> <code>${product.quantity} ${escapeHtml(product.unit)}</code>`,
      `<b>Min Required Stock:</b> <code>${product.minStock} ${escapeHtml(product.unit)}</code>`,
      `<b>Status:</b> ${isOut ? '❌ Item is completely out of stock!' : '📉 Stock is running critically low!'}`,
      '<i>Please restock this product as soon as possible.</i>',
    ].join('\n');

    return this.sendMessage(message);
  }
}

export const telegramService = new TelegramService();
