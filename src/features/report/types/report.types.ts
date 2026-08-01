import type { Movement } from '../../../services/movement';
import type { Product } from '../../../services/product';

export interface MonthlyReportSummary {
  totalSales: number;
  totalCost: number;
  netMargin: number;
  marginPercentage: number;
  totalItemsSold: number;
  totalItemsReturned: number;
  totalItemsDamaged: number;
  totalLosses: number;
  orderCount: number;
}

export interface ProductReportItem {
  productId: string;
  productName: string;
  category: string;
  buyPrice: number;
  sellPrice: number;
  quantitySold: number;
  quantityReturned: number;
  quantityDamaged: number;
  totalSales: number;
  totalCost: number;
  netMargin: number;
  marginPercentage: number;
}

export interface MonthOption {
  value: string; // e.g. "2026-07" or "ALL"
  label: string; // e.g. "July 2026" or "All Time"
}

export interface ReportFilter {
  selectedMonth: string; // "YYYY-MM" or "ALL"
  searchQuery: string;
}

export interface CalculatedMovementItem extends Movement {
  effectiveSaleAmount: number;
  effectiveCostAmount: number;
  effectiveMarginAmount: number;
  productDetails?: Product;
}
