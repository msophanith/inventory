import { useMemo, useState } from 'react';
import { useProduct } from '../features/product/hooks/use-product';
import { usePosStore, usePosCartTotals } from '../features/sell/store/use-pos-store';
import { useCheckout } from '../features/sell/hooks/use-checkout';
import { useMovement } from '../features/movement/hooks/use-movement';
import { useHardwareScanner } from '../features/sell/hooks/use-hardware-scanner';
import { playScanSound } from '../features/sell/utils/scan-sound';
import {
  PosCartPanel,
  PosDiscountModal,
  PosMobileCartBar,
  PosProductGrid,
} from '../features/sell/components';
import { PosHeaderBanner } from '../features/sell/components/pos-header-banner';
import { PosModals } from '../features/sell/components/pos-modals';
import Toast from '../components/ui/alert';
import { PageContainer } from '../components/layout/page-container';
import { useSellPageState } from './hooks/use-sell-page-state';
import type { PaymentMethod } from '../features/sell/types/sell.types';

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
  
  const cart = usePosStore();
  const { subtotal, tax, totalAmount: finalTotal, itemCount } = usePosCartTotals();
  const checkout = useCheckout();

  const {
    alert,
    setAlert,
    handleStockExceeded,
    handleBarcodeScanned,
  } = useSellPageState(products);

  useHardwareScanner({
    enabled:
      !checkout.isCheckoutOpen &&
      !cart.isCameraScanOpen &&
      !cart.isMobileCartOpen &&
      !cart.isOrderHistoryOpen &&
      !cart.isDiscountOpen,
    onScan: handleBarcodeScanned,
  });

  const handleConfirmPayment = async (params: {
    paymentMethod: PaymentMethod;
    amountPaid: number;
    customerNote?: string;
  }) => {
    await checkout.processCheckout({
      items: cart.items,
      subtotal: subtotal,
      tax: tax,
      discount: cart.discount.amount,
      total: finalTotal,
      amountPaid: params.amountPaid,
      paymentMethod: params.paymentMethod,
      customerNote: params.customerNote,
    });
    cart.clearCart();
    cart.setIsMobileCartOpen(false);
  };

  return (
    <PageContainer className='space-y-5 pb-24 lg:pb-0'>
      {alert && (
        <Toast
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <PosHeaderBanner
        onOpenScanModal={() => cart.setIsCameraScanOpen(true)}
        onOpenReceiptHistory={() => cart.setIsOrderHistoryOpen(true)}
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
          onAddToCart={(p) => {
            playScanSound();
            cart.addItem(p);
          }}
          onOpenScanModal={() => cart.setIsCameraScanOpen(true)}
        />

        <PosCartPanel
          items={cart.items}
          subtotal={subtotal}
          tax={tax}
          discount={cart.discount.amount}
          totalAmount={finalTotal}
          itemCount={itemCount}
          onOpenDiscount={() => cart.setIsDiscountOpen(true)}
          onUpdateQty={cart.updateQuantity}
          onSetExactQty={cart.setExactQuantity}
          onUpdatePrice={cart.updateUnitPrice}
          onUpdateUnit={cart.updateUnit}
          onRemoveItem={cart.removeItem}
          onClearCart={() => {
            cart.clearCart();
          }}
          onCheckout={() => checkout.setIsCheckoutOpen(true)}
          onStockExceeded={handleStockExceeded}
        />
      </div>

      <PosMobileCartBar
        itemCount={itemCount}
        totalAmount={finalTotal}
        onOpenCartDrawer={() => cart.setIsMobileCartOpen(true)}
        onOpenScanModal={() => cart.setIsCameraScanOpen(true)}
      />

      <PosDiscountModal
        open={cart.isDiscountOpen}
        subtotal={subtotal}
        onClose={() => cart.setIsDiscountOpen(false)}
        onApplyDiscount={cart.setDiscount}
      />

      <PosModals
        cartItems={cart.items}
        subtotal={subtotal}
        tax={tax}
        totalAmount={finalTotal}
        itemCount={itemCount}
        movements={movements}
        isMobileCartOpen={cart.isMobileCartOpen}
        isCameraScanOpen={cart.isCameraScanOpen}
        isCheckoutOpen={checkout.isCheckoutOpen}
        isOrderHistoryOpen={cart.isOrderHistoryOpen}
        checkoutPending={checkout.isPending}
        receiptData={checkout.receiptData}
        onCloseMobileCart={() => cart.setIsMobileCartOpen(false)}
        onCloseCameraScan={() => cart.setIsCameraScanOpen(false)}
        onCloseCheckout={() => checkout.setIsCheckoutOpen(false)}
        onCloseOrderHistory={() => cart.setIsOrderHistoryOpen(false)}
        onCloseReceipt={() => checkout.setReceiptData(null)}
        onBarcodeScanned={handleBarcodeScanned}
        onConfirmPayment={handleConfirmPayment}
        onUpdateQty={cart.updateQuantity}
        onSetExactQty={cart.setExactQuantity}
        onUpdatePrice={cart.updateUnitPrice}
        onUpdateUnit={cart.updateUnit}
        onRemoveItem={cart.removeItem}
        onClearCart={() => {
          cart.clearCart();
        }}
        onCheckout={() => checkout.setIsCheckoutOpen(true)}
        onStockExceeded={handleStockExceeded}
        onOpenReceipt={(receipt) => checkout.setReceiptData(receipt)}
      />
    </PageContainer>
  );
};

export { SellPage };
