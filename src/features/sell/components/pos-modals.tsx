import type { Movement } from '../../../services/movement';
import type { CartItem, PaymentMethod, ReceiptData } from '../types/sell.types';
import {
  PosCameraScannerModal,
  PosCheckoutModal,
  PosMobileCartDrawer,
  PosOrderHistoryModal,
  PosReceiptModal,
} from '.';

interface Props {
  readonly cartItems: CartItem[];
  readonly subtotal: number;
  readonly tax: number;
  readonly totalAmount: number;
  readonly itemCount: number;
  readonly movements: Movement[];
  readonly isMobileCartOpen: boolean;
  readonly isCameraScanOpen: boolean;
  readonly isCheckoutOpen: boolean;
  readonly isOrderHistoryOpen: boolean;
  readonly checkoutPending: boolean;
  readonly receiptData: ReceiptData | null;
  readonly onCloseMobileCart: () => void;
  readonly onCloseCameraScan: () => void;
  readonly onCloseCheckout: () => void;
  readonly onCloseOrderHistory: () => void;
  readonly onCloseReceipt: () => void;
  readonly onBarcodeScanned: (code: string) => void;
  readonly onConfirmPayment: (params: {
    paymentMethod: PaymentMethod;
    amountPaid: number;
  }) => void;
  readonly onUpdateQty: (productId: string, delta: number) => void;
  readonly onSetExactQty: (productId: string, exactQty: number) => void;
  readonly onUpdatePrice: (productId: string, newPrice: number) => void;
  readonly onRemoveItem: (productId: string) => void;
  readonly onClearCart: () => void;
  readonly onCheckout: () => void;
  readonly onStockExceeded: (productName: string, maxStock: number) => void;
  readonly onOpenReceipt: (receipt: ReceiptData) => void;
}

export function PosModals({
  cartItems,
  subtotal,
  tax,
  totalAmount,
  itemCount,
  movements,
  isMobileCartOpen,
  isCameraScanOpen,
  isCheckoutOpen,
  isOrderHistoryOpen,
  checkoutPending,
  receiptData,
  onCloseMobileCart,
  onCloseCameraScan,
  onCloseCheckout,
  onCloseOrderHistory,
  onCloseReceipt,
  onBarcodeScanned,
  onConfirmPayment,
  onUpdateQty,
  onSetExactQty,
  onUpdatePrice,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onStockExceeded,
  onOpenReceipt,
}: Props) {
  return (
    <>
      <PosMobileCartDrawer
        open={isMobileCartOpen}
        items={cartItems}
        subtotal={subtotal}
        tax={tax}
        totalAmount={totalAmount}
        itemCount={itemCount}
        onClose={onCloseMobileCart}
        onUpdateQty={onUpdateQty}
        onSetExactQty={onSetExactQty}
        onUpdatePrice={onUpdatePrice}
        onRemoveItem={onRemoveItem}
        onClearCart={onClearCart}
        onCheckout={onCheckout}
        onStockExceeded={onStockExceeded}
      />
      <PosCameraScannerModal
        open={isCameraScanOpen}
        onClose={onCloseCameraScan}
        onDetectedBarcode={onBarcodeScanned}
      />
      <PosCheckoutModal
        open={isCheckoutOpen}
        total={totalAmount}
        isPending={checkoutPending}
        onClose={onCloseCheckout}
        onConfirm={onConfirmPayment}
      />
      <PosReceiptModal receipt={receiptData} onClose={onCloseReceipt} />
      <PosOrderHistoryModal
        open={isOrderHistoryOpen}
        movements={movements}
        onClose={onCloseOrderHistory}
        onOpenReceipt={onOpenReceipt}
      />
    </>
  );
}
