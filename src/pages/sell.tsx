import { useCallback, useMemo, useState } from 'react';
import { useProduct } from '../features/product/hooks/use-product';
import { usePosCart } from '../features/sell/hooks/use-pos-cart';
import { useCheckout } from '../features/sell/hooks/use-checkout';
import { useHardwareScanner } from '../features/sell/hooks/use-hardware-scanner';
import { playScanSound } from '../features/sell/utils/scan-sound';
import {
  PosCameraScannerModal,
  PosCartPanel,
  PosCheckoutModal,
  PosMobileCartBar,
  PosMobileCartDrawer,
  PosProductGrid,
  PosReceiptModal,
} from '../features/sell/components';
import Alert from '../components/ui/alert';
import { PageContainer } from '../components/layout/page-container';

const SellPage = () => {
  const { useGetProducts } = useProduct(false);
  const { data: response, isLoading: productsLoading } = useGetProducts({ limit: 100 });
  const products = useMemo(() => response?.data || [], [response?.data]);

  const cart = usePosCart();
  const checkout = useCheckout();
  const [isCameraScanOpen, setIsCameraScanOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleBarcodeScanned = useCallback(
    (code: string) => {
      const clean = code.trim().toLowerCase();
      const target = products.find(
        (p) => p.barcode?.toLowerCase() === clean || p.id.toLowerCase() === clean || p.name.toLowerCase() === clean,
      );

      if (target) {
        if (target.quantity <= 0) {
          setAlert({ type: 'error', message: `"${target.name}" is out of stock!` });
          return;
        }
        playScanSound();
        cart.addItem(target);
        setAlert({ type: 'success', message: `Added "${target.name}" to cart` });
      } else {
        setAlert({ type: 'error', message: `No product found for barcode: "${code}"` });
      }
    },
    [products, cart],
  );

  useHardwareScanner({
    enabled: !checkout.isCheckoutOpen && !isCameraScanOpen && !isMobileCartOpen,
    onScan: handleBarcodeScanned,
  });

  const handleConfirmPayment = async (params: { paymentMethod: 'CASH' | 'CARD' | 'QR'; amountPaid: number }) => {
    await checkout.processCheckout({
      items: cart.items,
      subtotal: cart.subtotal,
      tax: cart.tax,
      discount: 0,
      total: cart.totalAmount,
      amountPaid: params.amountPaid,
      paymentMethod: params.paymentMethod,
    });
    cart.clearCart();
    setIsMobileCartOpen(false);
  };

  return (
    <PageContainer className='flex flex-col gap-6 lg:flex-row relative pb-24 lg:pb-0'>
      {alert && (
        <div className='fixed top-4 right-4 z-50 max-w-sm'>
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}

      <PosProductGrid
        products={products}
        cartItems={cart.items}
        isLoading={productsLoading}
        onAddToCart={(p) => { playScanSound(); cart.addItem(p); }}
        onOpenScanModal={() => setIsCameraScanOpen(true)}
      />

      <PosCartPanel
        items={cart.items}
        subtotal={cart.subtotal}
        tax={cart.tax}
        totalAmount={cart.totalAmount}
        itemCount={cart.itemCount}
        onUpdateQty={cart.updateQuantity}
        onUpdatePrice={cart.updateUnitPrice}
        onRemoveItem={cart.removeItem}
        onClearCart={cart.clearCart}
        onCheckout={() => checkout.setIsCheckoutOpen(true)}
      />

      <PosMobileCartBar
        itemCount={cart.itemCount}
        totalAmount={cart.totalAmount}
        onOpenCartDrawer={() => setIsMobileCartOpen(true)}
        onOpenScanModal={() => setIsCameraScanOpen(true)}
      />

      <PosMobileCartDrawer
        open={isMobileCartOpen}
        items={cart.items}
        subtotal={cart.subtotal}
        tax={cart.tax}
        totalAmount={cart.totalAmount}
        itemCount={cart.itemCount}
        onClose={() => setIsMobileCartOpen(false)}
        onUpdateQty={cart.updateQuantity}
        onUpdatePrice={cart.updateUnitPrice}
        onRemoveItem={cart.removeItem}
        onClearCart={cart.clearCart}
        onCheckout={() => checkout.setIsCheckoutOpen(true)}
      />

      <PosCameraScannerModal
        open={isCameraScanOpen}
        onClose={() => setIsCameraScanOpen(false)}
        onDetectedBarcode={handleBarcodeScanned}
      />
      <PosCheckoutModal
        open={checkout.isCheckoutOpen}
        items={cart.items}
        total={cart.totalAmount}
        isPending={checkout.isPending}
        onClose={() => checkout.setIsCheckoutOpen(false)}
        onConfirm={handleConfirmPayment}
      />
      <PosReceiptModal receipt={checkout.receiptData} onClose={() => checkout.setReceiptData(null)} />
    </PageContainer>
  );
};

export { SellPage };
