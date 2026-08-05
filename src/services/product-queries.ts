import { supabase } from '../utils/supabase';
import type { PaginatedResponse, Product, ProductQueryParams } from './product.types';
import { fetchProductSummary } from './product-summary-queries';

export { fetchProductSummary };

const TABLE_NAME = 'Product';

export async function fetchAllProducts(
  params?: ProductQueryParams,
): Promise<PaginatedResponse<Product>> {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const search = params?.search || '';
  const category = params?.category || '';

  if (limit >= 1000) {
    let allData: Product[] = [];
    let from = 0;
    const chunkSize = 1000;
    let totalCount: number;

    while (true) {
      let query = supabase.from(TABLE_NAME).select('*', { count: 'exact' });
      if (search)
        query = query.or(`name.ilike.%${search}%,barcode.ilike.%${search}%`);
      if (category) query = query.eq('category', category);

      const { data, error, count } = await query
        .order('createdAt', { ascending: false })
        .range(from, from + chunkSize - 1);

      if (error) throw new Error(error.message);

      const chunk = (data || []) as Product[];
      allData = allData.concat(chunk);
      totalCount = count || allData.length;

      if (chunk.length < chunkSize) break;
      from += chunkSize;
    }

    return {
      data: allData,
      count: totalCount,
      page: 1,
      limit: allData.length,
      totalPages: 1,
    };
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from(TABLE_NAME).select('*', { count: 'exact' });

  if (search) {
    query = query.or(`name.ilike.%${search}%,barcode.ilike.%${search}%`);
  }

  if (category) {
    query = query.eq('category', category);
  }

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

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? (data as Product) : null;
}

export async function fetchProductByBarcodeOrSearch(
  code: string,
): Promise<Product | null> {
  const clean = code.trim();
  if (!clean) return null;

  const { data: exact } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .or(`barcode.eq.${clean},id.eq.${clean}`)
    .maybeSingle();

  if (exact) return exact as Product;

  const { data: fuzzy } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .or(`name.ilike.%${clean}%,barcode.ilike.%${clean}%`)
    .limit(1)
    .maybeSingle();

  return fuzzy ? (fuzzy as Product) : null;
}

export async function fetchProductCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
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
