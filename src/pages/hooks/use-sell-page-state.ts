import { useCallback, useMemo } from 'react';
import { gooeyToast } from 'goey-toast';
import { productService } from '../../services';
import { playScanSound } from '../../features/sell/utils/scan-sound';
import type { Product } from '../../services/product';
import { usePosStore } from '../../features/sell/store/use-pos-store';
import { useLanguage } from '../../i18n/language-context';
import type { PaymentMethod } from '../../features/sell/types/sell.types';

export function useSellPageState(products: Product[]) {
  const addItem = usePosStore((state) => state.addItem);
  const { t } = useLanguage();

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of products) {
      if (p.barcode) map.set(p.barcode.toLowerCase(), p);
      if (p.id) map.set(p.id.toLowerCase(), p);
      if (p.name) map.set(p.name.toLowerCase(), p);
    }
    return map;
  }, [products]);

  const handleStockExceeded = useCallback(
    (productName: string, maxStock: number) => {
      gooeyToast.error(t('pos.stockLimitReached', { maxStock, productName }));
    },
    [t],
  );

  const handleBarcodeScanned = useCallback(
    async (code: string) => {
      const clean = code.trim().toLowerCase();
      if (!clean) return;

      let target = productMap.get(clean);
      if (!target) {
        target =
          (await productService.getByBarcodeOrSearch(clean)) ?? undefined;
      }

      if (target) {
        if (target.quantity <= 0) {
          gooeyToast.error(t('pos.itemOutOfStock', { name: target.name }));
          return;
        }
        playScanSound();
        addItem(target);
        gooeyToast.success(t('pos.addedToCart', { name: target.name }));
      } else {
        gooeyToast.error(t('pos.noProductFound', { code }));
      }
    },
    [productMap, addItem, t],
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
      },
    [],
  );

  return {
    handleStockExceeded,
    handleBarcodeScanned,
    createPaymentHandler,
  };
}
