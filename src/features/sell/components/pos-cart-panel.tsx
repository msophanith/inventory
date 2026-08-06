import { useState } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import type { CartItem, ReceiptData } from '../types/sell.types';
import { PosCartItem } from './pos-cart-item';
import { generatePdfInvoiceBlob } from '../utils/pdf-generator';
import { PosCartFooter } from './pos-cart-footer';

interface Props {
  readonly items: CartItem[];
  readonly subtotal: number;
  readonly tax: number;
  readonly discount?: number;
  readonly totalAmount: number;
  readonly itemCount: number;
  readonly onOpenDiscount?: () => void;
  readonly onUpdateQty: (productId: string, delta: number) => void;
  readonly onSetExactQty?: (productId: string, exactQty: number) => void;
  readonly onUpdatePrice: (productId: string, newPrice: number) => void;
  readonly onRemoveItem: (productId: string) => void;
  readonly onClearCart: () => void;
  readonly onCheckout: () => void;
  readonly onStockExceeded?: (productName: string, maxStock: number) => void;
}

export function PosCartPanel({
  items,
  subtotal,
  tax,
  discount = 0,
  totalAmount,
  itemCount,
  onOpenDiscount,
  onUpdateQty,
  onSetExactQty,
  onUpdatePrice,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onStockExceeded,
}: Props) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handlePreviewPdf = async () => {
    if (items.length === 0) return;
    try {
      setIsGeneratingPdf(true);
      const mockReceipt: ReceiptData = {
        orderId: `PREVIEW-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString(),
        paymentMethod: 'CASH',
        items: items.map((i) => ({
          product: i.product,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          totalPrice: i.quantity * i.unitPrice,
        })),
        subtotal,
        tax,
        discount,
        total: totalAmount,
        amountPaid: totalAmount,
        change: 0,
      };

      const blob = await generatePdfInvoiceBlob(mockReceipt);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error generating preview PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className='hidden lg:flex flex-col h-full rounded-3xl border border-slate-200 bg-white p-5 shadow-xs w-96 shrink-0 min-w-0'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-slate-100 pb-4'>
        <div className='flex items-center gap-2'>
          <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600'>
            <ShoppingCart size={20} />
          </div>
          <div>
            <h2 className='font-bold text-slate-900 text-base'>Current Order</h2>
            <p className='text-xs text-slate-400 font-medium'>
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={onClearCart}
            title='Clear Cart'
            className='flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-700 transition cursor-pointer'
          >
            <Trash2 size={14} /> Clear
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className='flex-1 overflow-y-auto py-4 space-y-2.5 max-h-105'>
        {items.length === 0 ? (
          <div className='flex h-48 flex-col items-center justify-center text-center text-slate-400'>
            <ShoppingCart size={32} className='text-slate-300 mb-2' />
            <p className='text-xs font-semibold text-slate-500'>Cart is empty</p>
            <p className='text-[11px] text-slate-400'>Scan barcode or click products to add.</p>
          </div>
        ) : (
          items.map((item) => (
            <PosCartItem
              key={item.product.id}
              item={item}
              onUpdateQty={onUpdateQty}
              onSetExactQty={onSetExactQty || ((id, qty) => onUpdateQty(id, qty - item.quantity))}
              onUpdatePrice={onUpdatePrice}
              onRemove={onRemoveItem}
              onStockExceeded={onStockExceeded}
            />
          ))
        )}
      </div>

      <PosCartFooter
        subtotal={subtotal}
        tax={tax}
        discount={discount}
        totalAmount={totalAmount}
        hasItems={items.length > 0}
        isGeneratingPdf={isGeneratingPdf}
        onOpenDiscount={onOpenDiscount}
        onPreviewPdf={handlePreviewPdf}
        onCheckout={onCheckout}
      />
    </div>
  );
}

