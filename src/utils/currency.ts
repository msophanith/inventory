export const DEFAULT_KHR_RATE = 4100;

export const getCurrentKhrRate = (): number => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('pos_khr_exchange_rate');
    if (saved) {
      const parsed = Number.parseInt(saved, 10);
      if (!Number.isNaN(parsed) && parsed > 0) return parsed;
    }
  }
  return DEFAULT_KHR_RATE;
};

export const formatCurrencyUsd = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

export const formatCurrencyKhr = (amountInUsd: number, rate = getCurrentKhrRate()) => {
  const khr = Math.round(amountInUsd * rate);
  return `៛${new Intl.NumberFormat('en-US').format(khr)}`;
};

export const formatDualCurrency = (amountInUsd: number, rate = getCurrentKhrRate()) => {
  return `${formatCurrencyUsd(amountInUsd)} (${formatCurrencyKhr(amountInUsd, rate)})`;
};
