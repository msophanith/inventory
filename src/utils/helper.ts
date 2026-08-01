/**
 * Calculate profit margin percentage
 *
 * Formula:
 * ((sellPrice - buyPrice) / sellPrice) * 100
 */
export const calculateMargin = (
  buyPrice: number,
  sellPrice: number,
): number => {
  if (sellPrice <= 0) {
    return 0;
  }

  return ((sellPrice - buyPrice) / sellPrice) * 100;
};

/**
 * Calculate profit amount per unit
 */
export const calculateProfit = (
  buyPrice: number,
  sellPrice: number,
): number => {
  return sellPrice - buyPrice;
};

/**
 * Calculate total inventory value
 */
export const calculateInventoryValue = (
  quantity: number,
  buyPrice: number,
): number => {
  return quantity * buyPrice;
};

/**
 * Calculate potential revenue
 */
export const calculatePotentialRevenue = (
  quantity: number,
  sellPrice: number,
): number => {
  return quantity * sellPrice;
};
