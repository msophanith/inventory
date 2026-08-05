import { useMemo, useState } from 'react';
import { useProduct } from '../features/product/hooks/use-product';
import { usePosCart } from '../features/sell/hooks/use-pos-cart';
import { useCheckout } from '../features/sell/hooks/use-checkout';
import { useMovement } from '../features/movement/hooks/use-movement';
import { useHardwareScanner } from '../features/sell/hooks/use-hardware-scanner';
import { playScanSound } from '../features/sell/utils/scan-sound';
import { PosCartPanel, PosMobileCartBar, PosProductGrid } from '../features/sell/components';
import { PosHeaderBanner } from '../features/sell/components/pos-header-banner';
import { PosModals } from '../features/sell/components/pos-modals';
import Toast from '../components/ui/alert';
import { PageContainer } from '../components/layout/page-container';
import { useSellPageState } from './hooks/use-sell-page-state';

const SellPage = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');

  const { useGetProducts } = useProduct(false);
  const { data: response, isLoading: productsLoading } = useGetProducts({
    search,
    category: category === 'ALL' ? '' : category,
    limit: 100,
  });
  const products = useMemo(() => response?.data || [], [response?.data]);

  const { data: movements = [] } = useMovement();
  const cart = usePosCart();
  const checkout = useCheckout();

  const {
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
  } = useSellPageState(products, cart);

  useHardwareScanner({
    enabled: !checkout.isCheckoutOpen && !isCameraScanOpen && !isMobileCartOpen && !isOrderHistoryOpen,
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
    <PageContainer className='space-y-5 pb-24 lg:pb-0'>
      {alert && <Toast type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <PosHeaderBanner
        onOpenScanModal={() => setIsCameraScanOpen(true)}
        onOpenReceiptHistory={() => setIsOrderHistoryOpen(true)}
      />

      <div className='flex flex-col gap-6 lg:flex-row relative'>
        <PosProductGrid
          products={products}
          cartItems={cart.items}
          isLoading={productsLoading}
          search={search}
          onSearchChange={setSearch}
          selectedCategory={category}
          onCategoryChange={setCategory}
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
          onSetExactQty={cart.setExactQuantity}
          onUpdatePrice={cart.updateUnitPrice}
          onRemoveItem={cart.removeItem}
          onClearCart={cart.clearCart}
          onCheckout={() => checkout.setIsCheckoutOpen(true)}
          onStockExceeded={handleStockExceeded}
        />
      </div>

      <PosMobileCartBar
        itemCount={cart.itemCount}
        totalAmount={cart.totalAmount}
        onOpenCartDrawer={() => setIsMobileCartOpen(true)}
        onOpenScanModal={() => setIsCameraScanOpen(true)}
      />

      <PosModals
        cartItems={cart.items}
        subtotal={cart.subtotal}
        tax={cart.tax}
        totalAmount={cart.totalAmount}
        itemCount={cart.itemCount}
        movements={movements}
        isMobileCartOpen={isMobileCartOpen}
        isCameraScanOpen={isCameraScanOpen}
        isCheckoutOpen={checkout.isCheckoutOpen}
        isOrderHistoryOpen={isOrderHistoryOpen}
        checkoutPending={checkout.isPending}
        receiptData={checkout.receiptData}
        onCloseMobileCart={() => setIsMobileCartOpen(false)}
        onCloseCameraScan={() => setIsCameraScanOpen(false)}
        onCloseCheckout={() => checkout.setIsCheckoutOpen(false)}
        onCloseOrderHistory={() => setIsOrderHistoryOpen(false)}
        onCloseReceipt={() => checkout.setReceiptData(null)}
        onBarcodeScanned={handleBarcodeScanned}
        onConfirmPayment={handleConfirmPayment}
        onUpdateQty={cart.updateQuantity}
        onSetExactQty={cart.setExactQuantity}
        onUpdatePrice={cart.updateUnitPrice}
        onRemoveItem={cart.removeItem}
        onClearCart={cart.clearCart}
        onCheckout={() => checkout.setIsCheckoutOpen(true)}
        onStockExceeded={handleStockExceeded}
        onOpenReceipt={(receipt) => checkout.setReceiptData(receipt)}
      />
    </PageContainer>
  );
};

export { SellPage };
