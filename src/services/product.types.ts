export interface StockMovement {
  id: string;
  productId: string;
  type: string;
  quantity: number;
  note?: string;
  reference?: string;
  createdAt: string;
  unitPrice?: number;
  isDamaged?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  barcode: string;
  category: string;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  minStock: number;
  shelf?: string;
  imageUrl?: string;
  unit: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductSummary {
  totalValue: number;
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
}
