import { create } from 'zustand';
import type { MovementType } from '@/services/movement';
import { formatDate } from '@/utils/date';

export type DateRangeFilter = 'ALL' | 'YESTERDAY' | 'LAST_7' | 'LAST_15';

export type AlertState = {
  type: 'success' | 'error';
  message: string;
};

interface MovementState {
  // --- Table Filters ---
  filterType: MovementType | 'ALL';
  dateRange: DateRangeFilter;
  selectedMonth: string;
  damagedOnly: boolean;
  searchQuery: string;
  page: number;
  pageSize: number;

  // --- Modal/Form State ---
  isMovementModalOpen: boolean;
  movementFormType: MovementType;
  alert: AlertState | null;

  // --- Actions ---
  setFilterType: (type: MovementType | 'ALL') => void;
  setDateRange: (range: DateRangeFilter) => void;
  setSelectedMonth: (month: string) => void;
  setDamagedOnly: (damaged: boolean) => void;
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setIsMovementModalOpen: (open: boolean) => void;
  setMovementFormType: (type: MovementType) => void;
  setAlert: (alert: AlertState | null) => void;
}

export const useMovementStore = create<MovementState>()((set) => ({
  // Initial State: default selectedMonth to current month (YYYY-MM)
  filterType: 'ALL',
  dateRange: 'ALL',
  selectedMonth: formatDate(new Date(), 'YYYY-MM'),
  damagedOnly: false,
  searchQuery: '',
  page: 1,
  pageSize: 10,

  isMovementModalOpen: false,
  movementFormType: 'IN',
  alert: null,

  // Actions
  setFilterType: (type) => set({ filterType: type, page: 1 }),
  setDateRange: (range) => set({ dateRange: range, page: 1 }),
  setSelectedMonth: (month) => set({ selectedMonth: month, page: 1 }),
  setDamagedOnly: (damaged) => set({ damagedOnly: damaged, page: 1 }),
  setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),
  setPage: (page) => set({ page }),
  setPageSize: (size) => set({ pageSize: size, page: 1 }),

  setIsMovementModalOpen: (open) => set({ isMovementModalOpen: open }),
  setMovementFormType: (type) => set({ movementFormType: type }),
  setAlert: (alert) => set({ alert }),
}));
