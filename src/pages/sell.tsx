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
  PosProductGrid,
  PosReceiptModal,
} from '../features/sell/components';
import Alert from '../components/ui/alert';
import { PageContainer } from '../components/layout/page-container';

const SellPage = () => {
  const { useGetProducts } = useProduct(false);
  const { data: response, isLoading: productsLoading } = useGetProducts({
    limit: 100,
  });
  const products = useMemo(() => response?.data || [], [response?.data]);

  const {
    items,
    addItem,
    updateQuantity,
    updateUnitPrice,
    removeItem,
    clearCart,
    subtotal,
    tax,
    totalAmount,
    itemCount,
  } = usePosCart();

  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    receiptData,
    setReceiptData,
    processCheckout,
    isPending,
  } = useCheckout();

  const [isCameraScanOpen, setIsCameraScanOpen] = useState(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Handle scanned barcode (from hardware USB gun, search box, or camera modal)
  const handleBarcodeScanned = useCallback(
    (code: string) => {
      const cleanCode = code.trim().toLowerCase();
      const target = products.find(
        (p) =>
          p.barcode?.toLowerCase() === cleanCode ||
          p.id.toLowerCase() === cleanCode ||
          p.name.toLowerCase() === cleanCode,
      );

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
    [products, addItem],
  );

  // Global hardware barcode scanner listener
  useHardwareScanner({
    enabled: !isCheckoutOpen && !isCameraScanOpen,
    onScan: handleBarcodeScanned,
  });

  const handleConfirmPayment = async (params: {
    paymentMethod: 'CASH' | 'CARD' | 'QR';
    amountPaid: number;
  }) => {
    await processCheckout({
      items,
      subtotal,
      tax,
      discount: 0,
      total: totalAmount,
      amountPaid: params.amountPaid,
      paymentMethod: params.paymentMethod,
    });
    clearCart();
  };

  return (
    <PageContainer className='flex flex-col gap-6 lg:flex-row relative'>
      {/* Toast Alert */}
      {alert && (
        <div className='fixed top-4 right-4 z-50 max-w-sm'>
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Product Catalog Section */}
      <PosProductGrid
        products={products}
        cartItems={items}
        isLoading={productsLoading}
        onAddToCart={(p) => {
          playScanSound();
          addItem(p);
        }}
        onOpenScanModal={() => setIsCameraScanOpen(true)}
      />

      {/* Cart Sidebar Panel */}
      <PosCartPanel
        items={items}
        subtotal={subtotal}
        tax={tax}
        totalAmount={totalAmount}
        itemCount={itemCount}
        onUpdateQty={updateQuantity}
        onUpdatePrice={updateUnitPrice}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Camera Barcode Scanner Modal */}
      <PosCameraScannerModal
        open={isCameraScanOpen}
        onClose={() => setIsCameraScanOpen(false)}
        onDetectedBarcode={handleBarcodeScanned}
      />

      {/* Payment Checkout Modal */}
      <PosCheckoutModal
        open={isCheckoutOpen}
        items={items}
        total={totalAmount}
        isPending={isPending}
        onClose={() => setIsCheckoutOpen(false)}
        onConfirm={handleConfirmPayment}
      />

      {/* Receipt Modal */}
      <PosReceiptModal
        receipt={receiptData}
        onClose={() => setReceiptData(null)}
      />
    </PageContainer>
  );
};

export { SellPage };
