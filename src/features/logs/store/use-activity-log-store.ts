import { create } from 'zustand';
import type { ActivityAction, ActivityLog } from '@/services/activity-log.types';

interface ActivityLogState {
  search: string;
  actionFilter: ActivityAction | 'ALL';
  dateRange: 'ALL' | 'TODAY' | 'WEEK' | 'MONTH';
  currentPage: number;
  selectedLog: ActivityLog | null;
  isDiffModalOpen: boolean;

  setSearch: (search: string) => void;
  setActionFilter: (action: ActivityAction | 'ALL') => void;
  setDateRange: (range: 'ALL' | 'TODAY' | 'WEEK' | 'MONTH') => void;
  setCurrentPage: (page: number) => void;
  setSelectedLog: (log: ActivityLog | null) => void;
  setIsDiffModalOpen: (open: boolean) => void;
  resetFilters: () => void;
}

export const useActivityLogStore = create<ActivityLogState>((set) => ({
  search: '',
  actionFilter: 'ALL',
  dateRange: 'ALL',
  currentPage: 1,
  selectedLog: null,
  isDiffModalOpen: false,

  setSearch: (search: string) => set({ search, currentPage: 1 }),
  setActionFilter: (actionFilter) => set({ actionFilter, currentPage: 1 }),
  setDateRange: (dateRange) => set({ dateRange, currentPage: 1 }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setSelectedLog: (selectedLog) => set({ selectedLog }),
  setIsDiffModalOpen: (isDiffModalOpen) => set({ isDiffModalOpen }),
  resetFilters: () =>
    set({
      search: '',
      actionFilter: 'ALL',
      dateRange: 'ALL',
      currentPage: 1,
    }),
}));
