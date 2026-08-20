import { useCallback, useMemo, useState } from 'react';
import { productService } from '../../services';
import { playScanSound } from '../../features/sell/utils/scan-sound';
import type { Product } from '../../services/product';
import { usePosStore } from '../../features/sell/store/use-pos-store';

export function useSellPageState(products: Product[]) {
  const addItem = usePosStore((state) => state.addItem);

  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

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
      setAlert({
        type: 'error',
        message: `Stock limit reached! Only ${maxStock} units of "${productName}" available in stock.`,
      });
    },
    [],
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
          setAlert({
            type: 'error',
            message: `"${target.name}" is out of stock!`,
          });
          return;
        }
        playScanSound();
        addItem(target);
        setAlert({
          type: 'success',
          message: `Added "${target.name}" to cart`,
        });
      } else {
        setAlert({
          type: 'error',
          message: `No product found for barcode: "${code}"`,
        });
      }
    },
    [productMap, addItem],
  );

  return {
    alert,
    setAlert,
    handleStockExceeded,
    handleBarcodeScanned,
  };
}
