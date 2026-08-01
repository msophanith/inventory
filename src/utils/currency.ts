export const DEFAULT_KHR_RATE = 4100;

export const formatCurrencyUsd = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

export const formatCurrencyKhr = (amountInUsd: number, rate = DEFAULT_KHR_RATE) => {
  const khr = Math.round(amountInUsd * rate);
  return `៛${new Intl.NumberFormat('en-US').format(khr)}`;
};

export const formatDualCurrency = (amountInUsd: number, rate = DEFAULT_KHR_RATE) => {
  return `${formatCurrencyUsd(amountInUsd)} (${formatCurrencyKhr(amountInUsd, rate)})`;
};
