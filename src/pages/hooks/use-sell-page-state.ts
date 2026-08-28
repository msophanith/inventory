import { useCallback, useMemo } from 'react';
import { gooeyToast } from 'goey-toast';
import { productService } from '../../services';
import { playScanSound } from '../../features/sell/utils/scan-sound';
import type { Product } from '../../services/product';
import { usePosStore } from '../../features/sell/store/use-pos-store';
import { useLanguage } from '../../i18n/language-context';

export function useSellPageState(products: Product[]) {
  const addItem = usePosStore((state) => state.addItem);
  const { t } = useLanguage();

  // O(1) indexed lookup map for fast barcode/ID scanning
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

  return {
    handleStockExceeded,
    handleBarcodeScanned,
  };
}
