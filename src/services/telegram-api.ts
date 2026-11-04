import type { TelegramReplyMarkup } from './telegram-buttons';

export interface TelegramSendOptions {
  replyMarkup?: TelegramReplyMarkup;
  disableNotification?: boolean;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithTimeout(url: string, init?: RequestInit, timeoutMs = 8000): Promise<Response> {
  return fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
}

export async function fetchTelegramBotInfo(botToken: string): Promise<{
  ok: boolean;
  username?: string;
  firstName?: string;
  error?: string;
}> {
  try {
    const res = await fetchWithTimeout(`https://api.telegram.org/bot${botToken}/getMe`);
    const data = await res.json();
    if (res.ok && data.ok) {
      return { ok: true, username: data.result?.username, firstName: data.result?.first_name };
    }
    return { ok: false, error: data.description || `HTTP ${res.status}` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network timeout' };
  }
}

export async function postTelegramMessage(
  botToken: string,
  chatId: string,
  text: string,
  options?: TelegramSendOptions,
  attempt = 1,
): Promise<boolean> {
  try {
    const body: Record<string, unknown> = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    };
    if (options?.disableNotification) body.disable_notification = true;
    if (options?.replyMarkup) body.reply_markup = options.replyMarkup;

    const res = await fetchWithTimeout(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.status === 429 && attempt < 2) {
      const data = await res.json().catch(() => ({}));
      const delay = Math.min(Number(data?.parameters?.retry_after) || 2, 5) * 1000;
      await wait(delay);
      return postTelegramMessage(botToken, chatId, text, options, attempt + 1);
    }

    if (!res.ok) {
      const plainBody = { ...body, text: text.replace(/<[^>]*>/g, ''), parse_mode: undefined };
      const fallbackRes = await fetchWithTimeout(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plainBody),
      });
      return fallbackRes.ok;
    }

    return true;
  } catch (err) {
    console.error('[TelegramAPI] postTelegramMessage error:', err);
    return false;
  }
}

export async function postTelegramDocument(
  botToken: string,
  chatId: string,
  fileBlob: Blob,
  fileName: string,
  caption?: string,
  options?: TelegramSendOptions,
  attempt = 1,
): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('document', fileBlob, fileName);
    if (caption) {
      formData.append('caption', caption);
      formData.append('parse_mode', 'HTML');
    }
    if (options?.disableNotification) formData.append('disable_notification', 'true');
    if (options?.replyMarkup) formData.append('reply_markup', JSON.stringify(options.replyMarkup));

    const res = await fetchWithTimeout(`https://api.telegram.org/bot${botToken}/sendDocument`, {
      method: 'POST',
      body: formData,
    });

    if (res.status === 429 && attempt < 2) {
      const data = await res.json().catch(() => ({}));
      const delay = Math.min(Number(data?.parameters?.retry_after) || 2, 5) * 1000;
      await wait(delay);
      return postTelegramDocument(botToken, chatId, fileBlob, fileName, caption, options, attempt + 1);
    }

    if (!res.ok && caption) {
      const fallbackForm = new FormData();
      fallbackForm.append('chat_id', chatId);
      fallbackForm.append('document', fileBlob, fileName);
      fallbackForm.append('caption', caption.replace(/<[^>]*>/g, ''));
      if (options?.replyMarkup) fallbackForm.append('reply_markup', JSON.stringify(options.replyMarkup));

      const fallbackRes = await fetchWithTimeout(`https://api.telegram.org/bot${botToken}/sendDocument`, {
        method: 'POST',
        body: fallbackForm,
      });
      return fallbackRes.ok;
    }

    return res.ok;
  } catch (err) {
    console.error('[TelegramAPI] postTelegramDocument error:', err);
    return false;
  }
}

