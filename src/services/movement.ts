import { supabase } from '../utils/supabase';
import { v4 as uuidv4 } from 'uuid';

import type { Product } from './product';
import { productService } from '.';
import { telegramService } from './telegram';

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
  product?: Product; // For JOINs
}

export type MovementType = 'IN' | 'OUT' | 'RETURN';

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

export class MovementService {
  private readonly tableName = 'StockMovement';

  async getAll(filters?: MovementFilter): Promise<Movement[]> {
    let query = supabase
      .from(this.tableName)
      .select('*, product:Product(*)')
      .order('createdAt', {
        ascending: false,
      });

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

    return data as Movement[];
  }

  /**
   * Fetch product movements by product ID
   */
  async getMovementsByProductId(productId: string): Promise<Movement[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*, product:Product(name)')
      .eq('productId', productId)
      .order('createdAt', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data || []) as Movement[];
  }

  async getById(id: number): Promise<Movement | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async addMovement(
    movement: Partial<Movement>,
    skipNotification = false,
  ): Promise<Movement> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert({
        id: movement.id || uuidv4(),
        productId: movement.productId,
        type: movement.type,
        quantity: movement.quantity,
        unitPrice: movement.unitPrice,
        isDamaged: movement.isDamaged ?? false,
        note: movement.note,
        reference: movement.reference,
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const createdMovement = data as Movement;

    // 2. Fetch product and update quantity
    if (movement.productId) {
      const product = await productService.getById(movement.productId);

      if (product) {
        let delta = movement.quantity || 0;
        if (movement.type === 'OUT') {
          delta = -delta;
        } else if (movement.type === 'RETURN') {
          // Returns: restock only if not damaged
          delta = movement.isDamaged ? 0 : Math.abs(delta);
        }

        const newQty = Math.max(0, product.quantity + delta);
        await productService.update(String(movement.productId), {
          ...product,
          quantity: newQty,
          shelf: product.shelf ?? '',
          description: product.description ?? '',
        });

        // 3. Send Telegram movement notification asynchronously
        if (!skipNotification) {
          telegramService.sendMovementNotification(createdMovement, product);
        }
      }
    } else if (!skipNotification) {
      telegramService.sendMovementNotification(createdMovement, null);
    }

    return createdMovement;
  }

  /**
   * Get today's sales summary
   */
  async getTodaySale(): Promise<TodaySaleSummary> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('StockMovement')
      .select('quantity, unitPrice')
      .eq('type', 'OUT')
      .eq('isDamaged', false)
      .gte('createdAt', start.toISOString())
      .lte('createdAt', end.toISOString());

    if (error) {
      throw new Error(error.message);
    }

    const movements = data ?? [];

    const totalSales = movements.reduce(
      (sum, item) => sum + item.quantity * (item.unitPrice ?? 0),
      0,
    );

    const totalItemsSold = movements.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    return {
      totalSales,
      totalOrders: movements.length,
      totalItemsSold,
    };
  }
}
