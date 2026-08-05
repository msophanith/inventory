import { supabase } from '../utils/supabase';
import type { ProductSummary } from './product.types';

const TABLE_NAME = 'Product';

export async function fetchProductSummary(): Promise<ProductSummary> {
  let allProducts: any[] = [];
  let from = 0;
  const limit = 1000;

  while (true) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('quantity, buyPrice, minStock')
      .range(from, from + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    const products = data || [];
    allProducts = allProducts.concat(products);

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
