export interface TelegramInlineButton {
  text: string;
  url: string;
}

export interface TelegramReplyMarkup {
  inline_keyboard: TelegramInlineButton[][];
}

function getAppUrl(path: string): string {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${cleanBase}${cleanPath}`;
}

export function buildSaleButtons(): TelegramReplyMarkup | undefined {
  const sellUrl = getAppUrl('/sell');
  const reportUrl = getAppUrl('/report');
  if (!sellUrl) return undefined;

  return {
    inline_keyboard: [
      [
        { text: '🛒 POS Terminal', url: sellUrl },
        { text: '📊 Sales Reports', url: reportUrl },
      ],
    ],
  };
}

export function buildLowStockButtons(barcode?: string): TelegramReplyMarkup | undefined {
  const movementUrl = getAppUrl('/movement');
  const searchParam = encodeURIComponent(barcode || '');
  const catalogUrl = getAppUrl(`/products${searchParam ? `?search=${searchParam}` : ''}`);
  if (!movementUrl) return undefined;

  return {
    inline_keyboard: [
      [
        { text: '📥 Restock in Movement', url: movementUrl },
        { text: '📦 View Catalog', url: catalogUrl },
      ],
    ],
  };
}

export function buildDailyReportButtons(): TelegramReplyMarkup | undefined {
  const reportUrl = getAppUrl('/report');
  const sellUrl = getAppUrl('/sell');
  if (!reportUrl) return undefined;

  return {
    inline_keyboard: [
      [
        { text: '📈 Financial Analytics', url: reportUrl },
        { text: '🛒 Open POS', url: sellUrl },
      ],
    ],
  };
}

export function buildMovementButtons(productId?: string): TelegramReplyMarkup | undefined {
  const movementUrl = getAppUrl('/movement');
  const productUrl = productId ? getAppUrl(`/products/${productId}`) : getAppUrl('/products');
  if (!movementUrl) return undefined;

  return {
    inline_keyboard: [
      [
        { text: '📋 Movement Logs', url: movementUrl },
        { text: '📦 Product Item', url: productUrl },
      ],
    ],
  };
}

