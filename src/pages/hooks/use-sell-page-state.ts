import { useCallback, useState } from 'react';
import { productService } from '../../services';
import { playScanSound } from '../../features/sell/utils/scan-sound';
import type { Product } from '../../services/product';

export function useSellPageState(
  products: Product[],
  cart: { addItem: (p: Product) => void },
) {
  const [isCameraScanOpen, setIsCameraScanOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

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

      let target = products.find(
        (p) =>
          p.barcode?.toLowerCase() === clean ||
          p.id.toLowerCase() === clean ||
          p.name.toLowerCase() === clean,
      );

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
        cart.addItem(target);
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
    [products, cart],
  );

  return {
    isCameraScanOpen,
    setIsCameraScanOpen,
    isMobileCartOpen,
    setIsMobileCartOpen,
    isOrderHistoryOpen,
    setIsOrderHistoryOpen,
    alert,
    setAlert,
    handleStockExceeded,
    handleBarcodeScanned,
  };
}
