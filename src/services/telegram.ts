import type { ReceiptData } from '../features/sell/types/sell.types';
import { generatePdfInvoiceBlob } from '../features/sell/utils/pdf-generator';
import type { Movement } from './movement';
import type { Product } from './product';
import {
  formatLowStockAlertMessage,
  formatMovementNotificationMessage,
  formatSaleNotificationCaption,
} from './telegram-formatter';

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
    if (!this.botToken || !this.chatId) return false;
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
    const message = formatMovementNotificationMessage(movement, product);
    return this.sendMessage(message);
  }

  async sendSaleNotification(receipt: ReceiptData): Promise<boolean> {
    const caption = formatSaleNotificationCaption(receipt);

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
    const message = formatLowStockAlertMessage(product);
    return this.sendMessage(message);
  }
}

export const telegramService = new TelegramService();
