import { supabase } from '@/utils/supabase';
import type { PaginatedResponse } from './product.types';
import type { ActivityLog, ActivityLogFilter } from './activity-log.types';
import { ActivityLogStorage } from './activity-log-storage';

export const ACTIVITY_LOG_TABLE = 'ActivityLog';

export async function fetchActivityLogs(
  filter?: ActivityLogFilter,
): Promise<PaginatedResponse<ActivityLog>> {
  const page = filter?.page || 1;
  const limit = filter?.limit || 15;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    let query = supabase.from(ACTIVITY_LOG_TABLE).select('*', { count: 'exact' });

    if (filter?.entityId) {
      query = query.eq('entityId', filter.entityId);
    }
    if (filter?.action && filter.action !== 'ALL') {
      query = query.eq('action', filter.action);
    }
    if (filter?.search) {
      const term = filter.search.trim();
      query = query.or(
        `entityName.ilike.%${term}%,barcode.ilike.%${term}%,userEmail.ilike.%${term}%,userName.ilike.%${term}%`,
      );
    }
    if (filter?.userId) {
      query = query.eq('userId', filter.userId);
    }

    if (filter?.dateRange === 'TODAY') {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      query = query.gte('createdAt', start.toISOString());
    } else if (filter?.dateRange === 'WEEK') {
      const pastWeek = new Date();
      pastWeek.setDate(pastWeek.getDate() - 7);
      query = query.gte('createdAt', pastWeek.toISOString());
    } else if (filter?.dateRange === 'MONTH') {
      const pastMonth = new Date();
      pastMonth.setDate(pastMonth.getDate() - 30);
      query = query.gte('createdAt', pastMonth.toISOString());
    }

    const { data, error, count } = await query
      .order('createdAt', { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }

    const totalCount = count || (data?.length ?? 0);
    return {
      data: (data || []) as ActivityLog[],
      count: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit) || 1,
    };
  } catch (err) {
    console.warn('[ActivityLogQueries] Supabase query failed, using local storage fallback:', err);
    return fetchLocalActivityLogs(filter);
  }
}

function fetchLocalActivityLogs(filter?: ActivityLogFilter): PaginatedResponse<ActivityLog> {
  const page = filter?.page || 1;
  const limit = filter?.limit || 15;
  let list = ActivityLogStorage.getLocalLogs();

  if (filter?.entityId) {
    list = list.filter((l) => l.entityId === filter.entityId);
  }
  if (filter?.action && filter.action !== 'ALL') {
    list = list.filter((l) => l.action === filter.action);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (l) =>
        l.entityName.toLowerCase().includes(q) ||
        (l.barcode && l.barcode.toLowerCase().includes(q)) ||
        (l.userEmail && l.userEmail.toLowerCase().includes(q)) ||
        (l.userName && l.userName.toLowerCase().includes(q)),
    );
  }
  if (filter?.userId) {
    list = list.filter((l) => l.userId === filter.userId);
  }
  if (filter?.dateRange === 'TODAY') {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    list = list.filter((l) => new Date(l.createdAt) >= start);
  } else if (filter?.dateRange === 'WEEK') {
    const week = new Date();
    week.setDate(week.getDate() - 7);
    list = list.filter((l) => new Date(l.createdAt) >= week);
  } else if (filter?.dateRange === 'MONTH') {
    const month = new Date();
    month.setDate(month.getDate() - 30);
    list = list.filter((l) => new Date(l.createdAt) >= month);
  }

  const from = (page - 1) * limit;
  const paginated = list.slice(from, from + limit);

  return {
    data: paginated,
    count: list.length,
    page,
    limit,
    totalPages: Math.ceil(list.length / limit) || 1,
  };
}
