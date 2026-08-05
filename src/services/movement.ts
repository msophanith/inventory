import { supabase } from '../utils/supabase';
import { v4 as uuidv4 } from 'uuid';

import type { Movement, MovementFilter, TodaySaleSummary } from './movement.types';
import { productService } from '.';
import { telegramService } from './telegram';
import {
  fetchAllMovements,
  fetchMovementById,
  fetchMovementsByProductId,
  fetchTodaySaleSummary,
} from './movement-queries';

export type { Movement, MovementType, MovementFilter, TodaySaleSummary } from './movement.types';

export class MovementService {
  private readonly tableName = 'StockMovement';

  async getAll(filters?: MovementFilter): Promise<Movement[]> {
    return fetchAllMovements(filters);
  }

  async getMovementsByProductId(productId: string): Promise<Movement[]> {
    return fetchMovementsByProductId(productId);
  }

  async getById(id: number): Promise<Movement | null> {
    return fetchMovementById(id);
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

    if (movement.productId) {
      const product = await productService.getById(movement.productId);

      if (product) {
        let delta = movement.quantity || 0;
        if (movement.type === 'OUT') {
          delta = -delta;
        } else if (movement.type === 'RETURN') {
          delta = movement.isDamaged ? 0 : Math.abs(delta);
        }

        const newQty = Math.max(0, product.quantity + delta);
        await productService.update(String(movement.productId), {
          ...product,
          quantity: newQty,
          shelf: product.shelf ?? '',
          description: product.description ?? '',
        });

        if (!skipNotification) {
          telegramService.sendMovementNotification(createdMovement, product);
        }
      }
    } else if (!skipNotification) {
      telegramService.sendMovementNotification(createdMovement, null);
    }

    return createdMovement;
  }

  async getTodaySale(): Promise<TodaySaleSummary> {
    return fetchTodaySaleSummary();
  }
}
