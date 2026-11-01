import { useCallback, useRef, useState } from 'react';
import { gooeyToast } from 'goey-toast';
import { productService } from '@/services';
import { playScanSound } from '@/features/sell/utils/scan-sound';
import type { Product } from '@/services/product';
import { usePosStore } from '@/features/sell/store/use-pos-store';
import { useLanguage } from '@/i18n/language-context';
import type { PaymentMethod } from '@/features/sell/types/sell.types';

export function useSellPageState() {
  const addItem = usePosStore((state) => state.addItem);
  const { t } = useLanguage();
  const [lastScannedProduct, setLastScannedProduct] = useState<Product | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const cacheRef = useRef<Map<string, Product>>(new Map());

  const handleStockExceeded = useCallback(
    (productName: string, maxStock: number) => {
      gooeyToast.error(t('pos.stockLimitReached', { maxStock, productName }));
    },
    [t],
  );

  const handleSelectProduct = useCallback(
    (product: Product) => {
      if (product.quantity <= 0) {
        gooeyToast.error(t('pos.itemOutOfStock', { name: product.name }));
        return;
      }
      playScanSound();
      addItem(product);
      setLastScannedProduct(product);
      gooeyToast.success(t('pos.addedToCart', { name: product.name }));
    },
    [addItem, t],
  );

  const handleBarcodeScanned = useCallback(
    async (code: string) => {
      const clean = code.trim().toLowerCase();
      if (!clean) return;

      setIsSearching(true);
      try {
        let target = cacheRef.current.get(clean);
        if (!target) {
          target = (await productService.getByBarcodeOrSearch(clean)) ?? undefined;
          if (target) {
            if (target.barcode) cacheRef.current.set(target.barcode.toLowerCase(), target);
            if (target.id) cacheRef.current.set(target.id.toLowerCase(), target);
          }
        }

        if (target) {
          handleSelectProduct(target);
        } else {
          gooeyToast.error(t('pos.noProductFound', { code }));
        }
      } catch (err) {
        console.error('[useSellPageState] Lookup error:', err);
        gooeyToast.error(t('pos.noProductFound', { code }));
      } finally {
        setIsSearching(false);
      }
    },
    [handleSelectProduct, t],
  );

  const createPaymentHandler = useCallback(
    (
      checkout: { processCheckout: (args: any) => Promise<unknown> },
      totals: { subtotal: number; tax: number; finalTotal: number },
    ) =>
      async (params: {
        paymentMethod: PaymentMethod;
        amountPaid: number;
        customerNote?: string;
      }) => {
        const cart = usePosStore.getState();
        await checkout.processCheckout({
          items: cart.items,
          subtotal: totals.subtotal,
          tax: totals.tax,
          discount: cart.discount.amount,
          total: totals.finalTotal,
          amountPaid: params.amountPaid,
          paymentMethod: params.paymentMethod,
          customerNote: params.customerNote,
        });
        cart.clearCart();
        cart.setIsMobileCartOpen(false);
        setLastScannedProduct(null);
      },
    [],
  );

  return {
    lastScannedProduct,
    setLastScannedProduct,
    isSearching,
    handleStockExceeded,
    handleBarcodeScanned,
    handleSelectProduct,
    createPaymentHandler,
  };
}
