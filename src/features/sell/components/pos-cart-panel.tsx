import { CreditCard, ShoppingCart, Trash2 } from 'lucide-react';
import type { CartItem } from '../types/sell.types';
import { PosCartItem } from './pos-cart-item';

interface Props {
  readonly items: CartItem[];
  readonly subtotal: number;
  readonly tax: number;
  readonly totalAmount: number;
  readonly itemCount: number;
  readonly onUpdateQty: (productId: string, delta: number) => void;
  readonly onUpdatePrice: (productId: string, newPrice: number) => void;
  readonly onRemoveItem: (productId: string) => void;
  readonly onClearCart: () => void;
  readonly onCheckout: () => void;
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

export function PosCartPanel({
  items,
  subtotal,
  tax,
  totalAmount,
  itemCount,
  onUpdateQty,
  onUpdatePrice,
  onRemoveItem,
  onClearCart,
  onCheckout,
}: Props) {
  return (
    <div className='hidden lg:flex flex-col h-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm w-96 shrink-0 min-w-0'>
      {/* Panel Header */}
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
      <div className='flex-1 overflow-y-auto py-4 space-y-2.5 max-h-[420px]'>
        {items.length === 0 ? (
          <div className='flex h-48 flex-col items-center justify-center text-center text-slate-400'>
            <ShoppingCart size={32} className='text-slate-300 mb-2' />
            <p className='text-xs font-semibold text-slate-500'>Cart is empty</p>
            <p className='text-[11px] text-slate-400'>
              Scan barcode or click products on left to add.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <PosCartItem
              key={item.product.id}
              item={item}
              onUpdateQty={onUpdateQty}
              onUpdatePrice={onUpdatePrice}
              onRemove={onRemoveItem}
            />
          ))
        )}
      </div>

      {/* Order Summary & Checkout Button */}
      <div className='border-t border-slate-100 pt-4 space-y-3'>
        <div className='space-y-1.5 text-xs text-slate-600 font-medium'>
          <div className='flex justify-between'>
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {tax > 0 && (
            <div className='flex justify-between'>
              <span>Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
          )}
          <div className='flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100'>
            <span>Total Payable</span>
            <span className='text-emerald-600'>{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <button
          disabled={items.length === 0}
          onClick={onCheckout}
          className='flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/20 transition hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 cursor-pointer'
        >
          <CreditCard size={18} />
          <span>Proceed to Checkout</span>
        </button>
      </div>
    </div>
  );
}
