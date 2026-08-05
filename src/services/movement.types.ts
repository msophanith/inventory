import type { Product } from './product';

export type MovementType = 'IN' | 'OUT' | 'RETURN';

export interface Movement {
  id: string;
  productId: string;
  type: MovementType;
  quantity: number;
  unitPrice?: number | null;
  isDamaged?: boolean | null;
  note?: string | null;
  reference?: string | null;
  createdAt: Date | string;
  product?: Product;
}

export interface MovementFilter {
  type?: MovementType;
  isDamaged?: boolean;
  productId?: number;
}

export interface TodaySaleSummary {
  totalSales: number;
  totalOrders: number;
  totalItemsSold: number;
}
