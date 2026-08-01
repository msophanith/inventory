import type { ProductFormValues } from '../features/product/schema/product.schema';
import { supabase } from '../utils/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────

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

export class ProductService {
  private readonly TABLE_NAME = 'Product';

  /**
   * Fetch products with filtering and pagination
   */
  async getAll(
    params?: ProductQueryParams,
  ): Promise<PaginatedResponse<Product>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const search = params?.search || '';
    const category = params?.category || '';

    // Always start at offset 0 and return up to limit items
    const from = 0;
    const to = limit - 1;

    let query = supabase.from(this.TABLE_NAME).select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,barcode.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    // Apply pagination and ordering
    const { data, error, count } = await query
      .order('createdAt', { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(error.message);
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: (data || []) as Product[],
      count: totalCount,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Fetch a single product by ID
   */
  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data ? (data as Product) : null;
  }

  /**
   * Direct API lookup by barcode, ID, or name across entire 2000+ catalog
   */
  async getByBarcodeOrSearch(code: string): Promise<Product | null> {
    const clean = code.trim();
    if (!clean) return null;

    const { data: exact } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .or(`barcode.eq.${clean},id.eq.${clean}`)
      .maybeSingle();

    if (exact) return exact as Product;

    const { data: fuzzy } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .or(`name.ilike.%${clean}%,barcode.ilike.%${clean}%`)
      .limit(1)
      .maybeSingle();

    return fuzzy ? (fuzzy as Product) : null;
  }

  /**
   * Fetch all distinct product categories dynamically from database
   */
  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('category')
      .not('category', 'is', null);

    if (error) return [];

    const set = new Set<string>();
    (data || []).forEach((row) => {
      if (row.category && row.category.trim()) {
        set.add(row.category.trim());
      }
    });

    return Array.from(set).sort();
  }

  /**
   * Fetch a summary of product metrics
   */
  async getSummary(): Promise<ProductSummary> {
    // Note: If the catalog grows very large, consider moving this to a Supabase RPC function
    // to avoid transferring too much data. For now, we fetch all items using pagination to bypass the 1000 row limit.
    let allProducts: any[] = [];
    let from = 0;
    const limit = 1000;

    while (true) {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('quantity, buyPrice, minStock')
        .range(from, from + limit - 1);

      if (error) {
        throw new Error(error.message);
      }

      const products = data || [];
      allProducts = allProducts.concat(products);

      // If we received fewer items than the limit, we've reached the end
      if (products.length < limit) {
        break;
      }

      from += limit;
    }

    let totalValue = 0;
    let lowStockItems = 0;
    let outOfStockItems = 0;

    for (const product of allProducts) {
      const qty = product.quantity || 0;
      const price = product.buyPrice || 0;
      const min = product.minStock || 0;

      totalValue += qty * price;

      if (qty <= 0) {
        outOfStockItems++;
      } else if (qty <= min) {
        lowStockItems++;
      }
    }

    return {
      totalValue,
      totalItems: allProducts.length,
      lowStockItems,
      outOfStockItems,
    };
  }

  /**
   * Fetch out-of-stock products (quantity <= 0)
   */
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

  /**
   * Fetch low-stock products (0 < quantity <= minStock)
   */
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

  /**
   * Create a new product
   */
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

  /**
   * Update an existing product
   */
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

  /**
   * Delete a product
   */
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
