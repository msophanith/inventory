import { create } from 'zustand';
import type { PaginationState, SortingState } from '@tanstack/react-table';

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

  // --- UI State ---
  isCameraScanOpen: boolean;
  alert: AlertState | null;

  // --- Actions ---
  setSorting: (sorting: SortingState | ((old: SortingState) => SortingState)) => void;
  setPagination: (pagination: PaginationState | ((old: PaginationState) => PaginationState)) => void;
  setSearch: (search: string) => void;
  setIsCameraScanOpen: (open: boolean) => void;
  setAlert: (alert: AlertState | null) => void;
}

export const useProductStore = create<ProductState>()((set) => ({
  // Initial State
  sorting: [],
  pagination: { pageIndex: 0, pageSize: 10 },
  search: '',
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
  setIsCameraScanOpen: (open) => set({ isCameraScanOpen: open }),
  setAlert: (alert) => set({ alert }),
}));
