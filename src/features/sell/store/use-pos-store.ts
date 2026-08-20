import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../../../services/product';
import type { CartItem } from '../types/sell.types';

export type DiscountState = {
  type: 'PERCENT' | 'FIXED';
  value: number;
  amount: number;
};

interface PosState {
  // --- Cart State ---
  items: CartItem[];
  taxRate: number;
  discount: DiscountState;

  // --- Cart Actions ---
  addItem: (product: Product) => void;
  updateQuantity: (productId: string, delta: number) => void;
  setExactQuantity: (productId: string, exactQty: number) => void;
  updateUnitPrice: (productId: string, newUnitPrice: number) => void;
  updateUnit: (productId: string, newUnit: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  setDiscount: (discount: DiscountState) => void;

  // --- UI State ---
  isCheckoutOpen: boolean;
  isCameraScanOpen: boolean;
  isMobileCartOpen: boolean;
  isOrderHistoryOpen: boolean;
  isDiscountOpen: boolean;

  // --- UI Actions ---
  setIsCheckoutOpen: (open: boolean) => void;
  setIsCameraScanOpen: (open: boolean) => void;
  setIsMobileCartOpen: (open: boolean) => void;
  setIsOrderHistoryOpen: (open: boolean) => void;
  setIsDiscountOpen: (open: boolean) => void;
}

export const usePosStore = create<PosState>()(
  persist(
    (set) => ({
      // Initial Cart State
      items: [],
      taxRate: 0,
      discount: { type: 'PERCENT', value: 0, amount: 0 },

      // Initial UI State
      isCheckoutOpen: false,
      isCameraScanOpen: false,
      isMobileCartOpen: false,
      isOrderHistoryOpen: false,
      isDiscountOpen: false,

      // Cart Actions
      addItem: (product) => {
        if (product.quantity <= 0) return;

        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.product.id === product.id);
          if (existingIndex > -1) {
            const current = state.items[existingIndex];
            const newQty = Math.min(product.quantity, current.quantity + 1);
            const updated = [...state.items];
            updated[existingIndex] = {
              ...current,
              quantity: newQty,
              totalPrice: newQty * current.unitPrice,
            };
            return { items: updated };
          }
          return {
            items: [
              ...state.items,
              {
                product,
                quantity: 1,
                unitPrice: product.sellPrice,
                totalPrice: product.sellPrice,
                unit: product.unit || 'pcs',
              },
            ],
          };
        });
      },

      updateQuantity: (productId, delta) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.product.id !== productId) return item;
              const maxStock = item.product.quantity;
              const newQty = Math.min(maxStock, Math.max(0, item.quantity + delta));
              if (newQty === 0) return null;
              return {
                ...item,
                quantity: newQty,
                totalPrice: newQty * item.unitPrice,
              };
            })
            .filter(Boolean) as CartItem[],
        }));
      },

      setExactQuantity: (productId, exactQty) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.product.id !== productId) return item;
              const maxStock = item.product.quantity;
              const newQty = Math.min(maxStock, Math.max(0, exactQty));
              if (newQty === 0) return null;
              return {
                ...item,
                quantity: newQty,
                totalPrice: newQty * item.unitPrice,
              };
            })
            .filter(Boolean) as CartItem[],
        }));
      },

      updateUnitPrice: (productId, newUnitPrice) => {
        const validPrice = Math.max(0, newUnitPrice);
        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id !== productId) return item;
            return {
              ...item,
              unitPrice: validPrice,
              totalPrice: item.quantity * validPrice,
            };
          }),
        }));
      },

      updateUnit: (productId, newUnit) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id !== productId) return item;
            return {
              ...item,
              unit: newUnit,
            };
          }),
        }));
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      clearCart: () => {
        set({ items: [], discount: { type: 'PERCENT', value: 0, amount: 0 } });
      },

      setDiscount: (discount) => set({ discount }),

      // UI Actions
      setIsCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
      setIsCameraScanOpen: (open) => set({ isCameraScanOpen: open }),
      setIsMobileCartOpen: (open) => set({ isMobileCartOpen: open }),
      setIsOrderHistoryOpen: (open) => set({ isOrderHistoryOpen: open }),
      setIsDiscountOpen: (open) => set({ isDiscountOpen: open }),
    }),
    {
      name: 'pos-store',
      // Only persist cart data, not UI state (like open modals)
      partialize: (state) => ({
        items: state.items,
        taxRate: state.taxRate,
        discount: state.discount,
      }),
    }
  )
);

export const usePosCartTotals = () => {
  const items = usePosStore((state) => state.items);
  const taxRate = usePosStore((state) => state.taxRate);
  const discountAmount = usePosStore((state) => state.discount.amount);

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * taxRate;
  const totalAmount = Math.max(0, subtotal + tax - discountAmount);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { subtotal, tax, totalAmount, itemCount };
};
