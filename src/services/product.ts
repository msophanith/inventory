import type { ProductFormValues } from '../features/product/schema/product.schema';
import { supabase } from '../utils/supabase';
import type {
  PaginatedResponse,
  Product,
  ProductQueryParams,
  ProductSummary,
} from './product.types';
import {
  fetchAllProducts,
  fetchProductByBarcodeOrSearch,
  fetchProductById,
  fetchProductCategories,
  fetchProductSummary,
} from './product-queries';

export type {
  StockMovement,
  Product,
  ProductQueryParams,
  PaginatedResponse,
  ProductSummary,
} from './product.types';

export class ProductService {
  private readonly TABLE_NAME = 'Product';

  async getAll(params?: ProductQueryParams): Promise<PaginatedResponse<Product>> {
    return fetchAllProducts(params);
  }

  async getById(id: string): Promise<Product | null> {
    return fetchProductById(id);
  }

  async getByBarcodeOrSearch(code: string): Promise<Product | null> {
    return fetchProductByBarcodeOrSearch(code);
  }

  async getCategories(): Promise<string[]> {
    return fetchProductCategories();
  }

  async getSummary(): Promise<ProductSummary> {
    return fetchProductSummary();
  }

  async getOutOfStockProducts(limit = 10): Promise<Product[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .lte('quantity', 0)
      .order('updatedAt', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    return (data || []) as Product[];
  }

  async getLowStockProducts(limit = 10): Promise<Product[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .gt('quantity', 0)
      .order('quantity', { ascending: true })
      .limit(100);

    if (error) {
      throw new Error(error.message);
    }

    const items = (data || []) as Product[];
    return items
      .filter((p) => (p.quantity || 0) <= (p.minStock || 0))
      .slice(0, limit);
  }

  async create(product: ProductFormValues): Promise<Product> {
    const now = new Date().toISOString();
    const payload = {
      ...product,
      quantity: 0,
      createdAt: now,
      updatedAt: now,
    };

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Product;
  }

  async update(id: string, product: ProductFormValues): Promise<Product> {
    const payload = {
      ...product,
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Product;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}
