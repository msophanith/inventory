import type { ReceiptData } from '@/features/sell/types/sell.types';
import { generatePdfInvoiceBlob } from '@/features/sell/utils/pdf-generator';
import type { Movement } from './movement';
import type { Product } from './product';
import { fetchTodaySaleSummary } from './movement-queries';
import {
  formatDailySalesSummaryMessage,
  formatLowStockAlertMessage,
  formatMovementNotificationMessage,
  formatProductDeletedMessage,
  formatSaleNotificationCaption,
  formatUserLoginMessage,
  formatUserLogoutMessage,
  type AuthEventInfo,
} from './telegram-formatter';
import {
  fetchTelegramBotInfo,
  postTelegramDocument,
  postTelegramMessage,
  type TelegramSendOptions,
} from './telegram-api';
import {
  buildDailyReportButtons,
  buildLowStockButtons,
  buildMovementButtons,
  buildSaleButtons,
} from './telegram-buttons';

export interface TelegramTestResult {
  success: boolean;
  botName?: string;
  error?: string;
}

export class TelegramService {
  private get botToken(): string {
    return import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
  }

  private get chatId(): string {
    return import.meta.env.VITE_TELEGRAM_CHAT_ID || '';
  }

  async testConnection(): Promise<TelegramTestResult> {
    if (!this.botToken || !this.chatId) {
      return { success: false, error: 'Telegram bot token or Chat ID is missing.' };
    }
    const botInfo = await fetchTelegramBotInfo(this.botToken);
    if (!botInfo.ok) {
      return { success: false, error: botInfo.error || 'Invalid bot token.' };
    }
    const testMsg =
      `<b>🤖 Telegram Connection Verified</b>\n` +
      `Bot: <code>@${botInfo.username || 'Unknown'}</code>\n` +
      `System: Inventory & POS Notification Service Active.`;
    const sent = await this.sendMessage(testMsg);
    if (!sent) {
      return { success: false, error: 'Token is valid, but message sending to Chat ID failed.' };
    }
    return { success: true, botName: botInfo.username || botInfo.firstName };
  }

  private async sendMessage(text: string, options?: TelegramSendOptions): Promise<boolean> {
    if (!this.botToken || !this.chatId) return false;
    return postTelegramMessage(this.botToken, this.chatId, text, options);
  }

  async sendDocument(
    fileBlob: Blob,
    fileName: string,
    caption?: string,
    options?: TelegramSendOptions,
  ): Promise<boolean> {
    if (!this.botToken || !this.chatId) return false;
    return postTelegramDocument(this.botToken, this.chatId, fileBlob, fileName, caption, options);
  }

  async sendMovementNotification(movement: Movement, product?: Product | null): Promise<boolean> {
    const message = formatMovementNotificationMessage(movement, product);
    return this.sendMessage(message, { replyMarkup: buildMovementButtons(movement.productId) });
  }

  async sendSaleNotification(receipt: ReceiptData): Promise<boolean> {
    const caption = formatSaleNotificationCaption(receipt);
    const options: TelegramSendOptions = { replyMarkup: buildSaleButtons() };

    try {
      const pdfBlob = await generatePdfInvoiceBlob(receipt);
      const fileName = `Invoice_${receipt.orderId}.pdf`;
      const sent = await this.sendDocument(pdfBlob, fileName, caption, options);
      if (sent) return true;
    } catch (err) {
      console.error('[TelegramService] PDF invoice generation error:', err);
    }

    return this.sendMessage(caption, options);
  }

  async sendLowStockAlert(product: Product): Promise<boolean> {
    const message = formatLowStockAlertMessage(product);
    return this.sendMessage(message, { replyMarkup: buildLowStockButtons(product.barcode) });
  }

  async sendProductDeletedNotification(product: Product): Promise<boolean> {
    return this.sendMessage(formatProductDeletedMessage(product));
  }

  async sendLoginNotification(info: AuthEventInfo): Promise<boolean> {
    return this.sendMessage(formatUserLoginMessage(info));
  }

  async sendLogoutNotification(info: AuthEventInfo): Promise<boolean> {
    return this.sendMessage(formatUserLogoutMessage(info));
  }

  async sendDailySalesSummary(targetDate: Date = new Date()): Promise<boolean> {
    try {
      const summary = await fetchTodaySaleSummary(targetDate);
      const date = targetDate.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      const message = formatDailySalesSummaryMessage({ ...summary, date });
      return this.sendMessage(message, { replyMarkup: buildDailyReportButtons() });
    } catch (err) {
      console.error('[TelegramService] sendDailySalesSummary error:', err);
      return false;
    }
  }
}

export const telegramService = new TelegramService();
