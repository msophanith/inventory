import { create } from 'zustand';
import type { MovementType } from '../../../services/movement';

export type AlertState = {
  type: 'success' | 'error';
  message: string;
};

interface MovementState {
  // --- Table Filters ---
  filterType: MovementType | 'ALL';
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
  setDamagedOnly: (damaged: boolean) => void;
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setIsMovementModalOpen: (open: boolean) => void;
  setMovementFormType: (type: MovementType) => void;
  setAlert: (alert: AlertState | null) => void;
}

export const useMovementStore = create<MovementState>()((set) => ({
  // Initial State
  filterType: 'ALL',
  damagedOnly: false,
  searchQuery: '',
  page: 1,
  pageSize: 10,
  
  isMovementModalOpen: false,
  movementFormType: 'IN',
  alert: null,

  // Actions
  setFilterType: (type) => set({ filterType: type, page: 1 }), // Reset page on filter change
  setDamagedOnly: (damaged) => set({ damagedOnly: damaged, page: 1 }),
  setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),
  setPage: (page) => set({ page }),
  setPageSize: (size) => set({ pageSize: size, page: 1 }),
  
  setIsMovementModalOpen: (open) => set({ isMovementModalOpen: open }),
  setMovementFormType: (type) => set({ movementFormType: type }),
  setAlert: (alert) => set({ alert }),
}));
