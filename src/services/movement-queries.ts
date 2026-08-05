import { supabase } from '../utils/supabase';
import type { Movement, MovementFilter, TodaySaleSummary } from './movement.types';

const TABLE_NAME = 'StockMovement';

export async function fetchAllMovements(filters?: MovementFilter): Promise<Movement[]> {
  const PAGE_SIZE = 1000;
  let allMovements: Movement[] = [];
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    let query = supabase
      .from(TABLE_NAME)
      .select('*, product:Product(*)')
      .order('createdAt', { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.isDamaged !== undefined) {
      query = query.eq('isDamaged', filters.isDamaged);
    }

    if (filters?.productId) {
      query = query.eq('productId', filters.productId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    if (data && data.length > 0) {
      allMovements = allMovements.concat(data as Movement[]);
      if (data.length < PAGE_SIZE) {
        hasMore = false;
      } else {
        from += PAGE_SIZE;
      }
    } else {
      hasMore = false;
    }
  }

  return allMovements;
}

export async function fetchMovementsByProductId(productId: string): Promise<Movement[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*, product:Product(name)')
    .eq('productId', productId)
    .order('createdAt', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as Movement[];
}

export async function fetchMovementById(id: number): Promise<Movement | null> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function fetchTodaySaleSummary(): Promise<TodaySaleSummary> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(
      'quantity, unitPrice, type, isDamaged, reference, product:Product(buyPrice, sellPrice)',
    )
    .in('type', ['OUT', 'RETURN'])
    .gte('createdAt', start.toISOString())
    .lte('createdAt', end.toISOString());

  if (error) {
    throw new Error(error.message);
  }

  interface TodayMovementItem {
    quantity: number;
    unitPrice?: number | null;
    type: string;
    isDamaged?: boolean | null;
    reference?: string | null;
    product?: {
      buyPrice?: number | null;
      sellPrice?: number | null;
    } | null;
  }

  const movements = (data ?? []) as unknown as TodayMovementItem[];

  let totalSales = 0;
  let totalItemsSold = 0;
  let totalOrders = 0;

  for (const item of movements) {
    const isDamaged = Boolean(
      item.isDamaged || item.reference?.toLowerCase() === 'damage',
    );
    const qty = Math.abs(item.quantity || 0);
    const buyPrice = item.product?.buyPrice ?? 0;
    const sellPrice = item.unitPrice ?? item.product?.sellPrice ?? 0;

    if (item.type === 'OUT') {
      if (!isDamaged) {
        totalSales += qty * sellPrice;
        totalItemsSold += qty;
        totalOrders += 1;
      }
    } else if (item.type === 'RETURN') {
      if (isDamaged) {
        totalSales -= qty * buyPrice;
      } else {
        totalSales -= qty * sellPrice;
      }
      totalItemsSold -= qty;
    }
  }

  return {
    totalSales: Math.round(totalSales * 100) / 100,
    totalOrders,
    totalItemsSold: Math.max(0, totalItemsSold),
  };
}
