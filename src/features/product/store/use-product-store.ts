import { create } from 'zustand';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import type { StockFilterType } from '../components/product-table-header';
export type AlertState = {
  type: 'success' | 'error';
  message: string;
};

interface ProductState {
  // --- Table State ---
  sorting: SortingState;
  pagination: PaginationState;
  
  // --- Filter State ---
  search: string;
  stockFilter: StockFilterType;

  // --- UI State ---
  isCameraScanOpen: boolean;
  alert: AlertState | null;

  // --- Actions ---
  setSorting: (sorting: SortingState | ((old: SortingState) => SortingState)) => void;
  setPagination: (pagination: PaginationState | ((old: PaginationState) => PaginationState)) => void;
  setSearch: (search: string) => void;
  setStockFilter: (filter: StockFilterType) => void;
  setIsCameraScanOpen: (open: boolean) => void;
  setAlert: (alert: AlertState | null) => void;
}

export const useProductStore = create<ProductState>()((set) => ({
  // Initial State
  sorting: [],
  pagination: { pageIndex: 0, pageSize: 20 },
  search: '',
  stockFilter: 'ALL',
  isCameraScanOpen: false,
  alert: null,

  // Actions
  setSorting: (updater) =>
    set((state) => ({
      sorting: typeof updater === 'function' ? updater(state.sorting) : updater,
    })),
  setPagination: (updater) =>
    set((state) => ({
      pagination: typeof updater === 'function' ? updater(state.pagination) : updater,
    })),
  setSearch: (search) => set({ search }),
  setStockFilter: (stockFilter) => set({ stockFilter }),
  setIsCameraScanOpen: (open) => set({ isCameraScanOpen: open }),
  setAlert: (alert) => set({ alert }),
}));
