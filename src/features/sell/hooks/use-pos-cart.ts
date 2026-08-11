import { useCallback, useMemo, useState } from 'react';
import type { Product } from '../../../services/product';
import type { CartItem } from '../types/sell.types';

export function usePosCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [taxRate] = useState(0);
  const [discountAmount] = useState(0);

  const addItem = useCallback((product: Product) => {
    if (product.quantity <= 0) return;

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.product.id === product.id);
      if (existingIndex > -1) {
        const current = prev[existingIndex];
        const newQty = Math.min(product.quantity, current.quantity + 1);
        const updated = [...prev];
        updated[existingIndex] = {
          ...current,
          quantity: newQty,
          totalPrice: newQty * current.unitPrice,
        };
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          unitPrice: product.sellPrice,
          totalPrice: product.sellPrice,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setItems((prev) =>
      prev
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
    );
  }, []);

  const setExactQuantity = useCallback((productId: string, exactQty: number) => {
    setItems((prev) =>
      prev
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
    );
  }, []);

  const updateUnitPrice = useCallback((productId: string, newUnitPrice: number) => {
    const validPrice = Math.max(0, newUnitPrice);
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id !== productId) return item;
        return {
          ...item,
          unitPrice: validPrice,
          totalPrice: item.quantity * validPrice,
        };
      }),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.totalPrice, 0),
    [items],
  );

  const tax = useMemo(() => subtotal * taxRate, [subtotal, taxRate]);
  const totalAmount = useMemo(
    () => Math.max(0, subtotal + tax - discountAmount),
    [subtotal, tax, discountAmount],
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  return {
    items,
    addItem,
    updateQuantity,
    setExactQuantity,
    updateUnitPrice,
    removeItem,
    clearCart,
    subtotal,
    tax,
    discountAmount,
    totalAmount,
    itemCount,
  };
}
