import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/utils/supabase';
import type { AuthUser } from '@/types/auth';
import type { Product } from './product.types';
import type {
  ActivityLog,
  ActivityLogFilter,
  ActivityLogKPI,
  ProductChangeDetail,
} from './activity-log.types';
import {
  ACTIVITY_LOG_TABLE,
  fetchActivityLogs,
} from './activity-log-queries';
import { ActivityLogStorage } from './activity-log-storage';
import { computeProductDiff } from '@/features/logs/utils/log-diff-formatter';

export class ActivityLogService {
  async getAll(filter?: ActivityLogFilter) {
    return fetchActivityLogs(filter);
  }

  async getByProductId(productId: string): Promise<ActivityLog[]> {
    const res = await this.getAll({ entityId: productId, limit: 100 });
    return res.data;
  }

  async createLog(
    entry: Omit<ActivityLog, 'id' | 'createdAt'>,
  ): Promise<ActivityLog> {
    const log: ActivityLog = {
      ...entry,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    ActivityLogStorage.saveLocalLog(log);

    try {
      const { data, error } = await supabase
        .from(ACTIVITY_LOG_TABLE)
        .insert(log)
        .select()
        .maybeSingle();

      if (!error && data) {
        return data as ActivityLog;
      }
    } catch (err) {
      console.warn('[ActivityLogService] Could not persist to Supabase:', err);
    }

    return log;
  }

  async logProductCreated(product: Product, user?: AuthUser | null) {
    return this.createLog({
      action: 'CREATE',
      entityType: 'PRODUCT',
      entityId: product.id,
      entityName: product.name,
      barcode: product.barcode || null,
      userId: user?.id ?? null,
      userEmail: user?.email ?? null,
      userName: user?.fullName ?? user?.email?.split('@')[0] ?? 'Admin',
      userRole: user?.role ?? 'admin',
      details: {
        summary: `Created new product "${product.name}" with initial stock ${product.quantity} ${product.unit}`,
        snapshot: product as unknown as Record<string, unknown>,
      },
    });
  }

  async logProductUpdated(
    current: Product,
    previous: Product | null,
    user?: AuthUser | null,
    changes?: ProductChangeDetail[],
  ) {
    const diffs = changes || computeProductDiff(previous, current);

    return this.createLog({
      action: 'UPDATE',
      entityType: 'PRODUCT',
      entityId: current.id,
      entityName: current.name,
      barcode: current.barcode || null,
      userId: user?.id ?? null,
      userEmail: user?.email ?? null,
      userName: user?.fullName ?? user?.email?.split('@')[0] ?? 'Admin',
      userRole: user?.role ?? 'admin',
      details: {
        changes: diffs,
        summary: diffs.length > 0
          ? `Updated ${diffs.map((c) => c.label).join(', ')}`
          : `Updated product "${current.name}" details`,
        snapshot: current as unknown as Record<string, unknown>,
      },
    });
  }

  async logProductDeleted(product: Product, user?: AuthUser | null) {
    return this.createLog({
      action: 'DELETE',
      entityType: 'PRODUCT',
      entityId: product.id,
      entityName: product.name,
      barcode: product.barcode || null,
      userId: user?.id ?? null,
      userEmail: user?.email ?? null,
      userName: user?.fullName ?? user?.email?.split('@')[0] ?? 'Admin',
      userRole: user?.role ?? 'admin',
      details: {
        summary: `Deleted product "${product.name}" (Barcode: ${product.barcode || 'N/A'})`,
        snapshot: product as unknown as Record<string, unknown>,
      },
    });
  }

  async getKPIs(): Promise<ActivityLogKPI> {
    const res = await this.getAll({ limit: 1000 });
    const logs = res.data;
    return {
      totalLogs: res.count,
      totalCreated: logs.filter((l) => l.action === 'CREATE').length,
      totalUpdated: logs.filter((l) => l.action === 'UPDATE').length,
      totalDeleted: logs.filter((l) => l.action === 'DELETE').length,
    };
  }
}

export const activityLogService = new ActivityLogService();
