export type ActivityAction = 'CREATE' | 'UPDATE' | 'DELETE';

export interface ProductChangeDetail {
  field: string;
  label: string;
  oldValue: string | number | boolean | null | undefined;
  newValue: string | number | boolean | null | undefined;
}

export interface ActivityLogDetails {
  changes?: ProductChangeDetail[];
  summary?: string;
  snapshot?: Record<string, unknown>;
}

export interface ActivityLog {
  id: string;
  action: ActivityAction;
  entityType: 'PRODUCT';
  entityId: string;
  entityName: string;
  barcode?: string | null;
  userId?: string | null;
  userEmail?: string | null;
  userName?: string | null;
  userRole?: string | null;
  details?: ActivityLogDetails | null;
  createdAt: string;
}

export interface ActivityLogFilter {
  page?: number;
  limit?: number;
  action?: ActivityAction | 'ALL';
  search?: string;
  dateRange?: 'ALL' | 'TODAY' | 'WEEK' | 'MONTH';
  userId?: string;
  entityId?: string;
}

export interface ActivityLogKPI {
  totalLogs: number;
  totalCreated: number;
  totalUpdated: number;
  totalDeleted: number;
}
