import { supabase } from '@/utils/supabase';
import moment from 'moment';
import { PHNOM_PENH_TZ_OFFSET } from '@/utils/date';
import type { Movement } from './movement.types';

const TABLE_NAME = 'StockMovement';

export interface MonthTopSellerItem {
  productId: string;
  name: string;
  category: string;
  qtySold: number;
  revenue: number;
}

/**
 * Fetches recent stock movements optimized specifically for dashboard metrics.
 * Fetches only the required product columns and avoids unbounded full-table scans.
 */
export async function fetchDashboardMovements(
  limit = 500,
): Promise<Movement[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(
      'id, productId, type, quantity, unitPrice, isDamaged, reference, createdAt, product:Product(id, name, category, sellPrice, buyPrice)',
    )
    .order('createdAt', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as unknown as Movement[];
}

/**
 * Fetches only the current month's sales movements directly from Supabase,
 * avoiding scanning all historical movements across the database.
 */
export async function fetchMonthTopSellers(
  limit = 6,
): Promise<MonthTopSellerItem[]> {
  const startOfMonth = moment()
    .utcOffset(PHNOM_PENH_TZ_OFFSET)
    .startOf('month')
    .toISOString();
  const endOfMonth = moment()
    .utcOffset(PHNOM_PENH_TZ_OFFSET)
    .endOf('month')
    .toISOString();

  const PAGE_SIZE = 1000;
  let from = 0;
  let hasMore = true;
  const map = new Map<string, MonthTopSellerItem>();

  while (hasMore) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(
        'productId, quantity, unitPrice, isDamaged, reference, product:Product(id, name, category, sellPrice)',
      )
      .eq('type', 'OUT')
      .eq('isDamaged', false)
      .gte('createdAt', startOfMonth)
      .lte('createdAt', endOfMonth)
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      throw new Error(error.message);
    }

    const items = data || [];
    for (const m of items as any[]) {
      if (!m.product) continue;
      const id = m.productId || m.product.id;
      const qty = Math.abs(m.quantity || 0);
      const rev = qty * (m.unitPrice ?? m.product.sellPrice ?? 0);

      const existing = map.get(id) ?? {
        productId: id,
        name: m.product.name,
        category: m.product.category || 'General',
        qtySold: 0,
        revenue: 0,
      };
      existing.qtySold += qty;
      existing.revenue += rev;
      map.set(id, existing);
    }

    if (items.length < PAGE_SIZE) {
      hasMore = false;
    } else {
      from += PAGE_SIZE;
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.qtySold - a.qtySold)
    .slice(0, limit);
}
