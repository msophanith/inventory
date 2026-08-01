import { CreditCard, ShoppingCart, Trash2, X } from 'lucide-react';
import type { CartItem } from '../types/sell.types';
import { PosCartItem } from './pos-cart-item';

interface Props {
  readonly open: boolean;
  readonly items: CartItem[];
  readonly subtotal: number;
  readonly tax: number;
  readonly totalAmount: number;
  readonly itemCount: number;
  readonly onClose: () => void;
  readonly onUpdateQty: (productId: string, delta: number) => void;
  readonly onUpdatePrice: (productId: string, newPrice: number) => void;
  readonly onRemoveItem: (productId: string) => void;
  readonly onClearCart: () => void;
  readonly onCheckout: () => void;
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    val,
  );

export function PosMobileCartDrawer({
  open,
  items,
  subtotal,
  tax,
  totalAmount,
  itemCount,
  onClose,
  onUpdateQty,
  onUpdatePrice,
  onRemoveItem,
  onClearCart,
  onCheckout,
}: Props) {
  if (!open) return null;

  return (
    <div className='lg:hidden fixed inset-0 z-50 flex flex-col justify-end'>
      {/* Backdrop overlay */}
      <button
        type='button'
        aria-label='Close drawer'
        className='fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 border-none'
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className='relative z-10 w-full max-h-[85vh] rounded-t-3xl bg-white p-5 shadow-2xl space-y-4 flex flex-col animate-in slide-in-from-bottom duration-200'>
        {/* Drawer Drag handle & Header */}
        <div className='flex items-center justify-between border-b border-slate-100 pb-3.5'>
          <div className='flex items-center gap-2.5'>
            <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600'>
              <ShoppingCart size={20} />
            </div>
            <div>
              <h2 className='font-extrabold text-slate-900 text-base'>
                Current Order
              </h2>
              <p className='text-xs text-slate-400 font-semibold'>
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className='flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-700 transition cursor-pointer'
              >
                <Trash2 size={14} /> Clear
              </button>
            )}
            <button
              onClick={onClose}
              className='rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 transition cursor-pointer'
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Cart Item List */}
        <div className='flex-1 overflow-y-auto space-y-2.5 max-h-[360px] pr-1'>
          {items.length === 0 ? (
            <div className='flex h-40 flex-col items-center justify-center text-center text-slate-400'>
              <ShoppingCart size={32} className='text-slate-300 mb-2' />
              <p className='text-xs font-bold text-slate-500'>Cart is empty</p>
              <p className='text-[11px] text-slate-400 mt-1'>
                Tap products or scan barcode to add items.
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

        {/* Order Summary & Checkout Action */}
        <div className='border-t border-slate-100 pt-3.5 space-y-3'>
          <div className='space-y-1 text-xs text-slate-600 font-semibold'>
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
            <div className='flex justify-between text-base font-black text-slate-900 pt-1.5 border-t border-slate-100'>
              <span>Total Payable</span>
              <span className='text-emerald-600'>
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          <button
            disabled={items.length === 0}
            onClick={() => {
              onClose();
              onCheckout();
            }}
            className='flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-black text-white shadow-xl shadow-emerald-600/20 active:scale-98 transition disabled:opacity-50 cursor-pointer'
          >
            <CreditCard size={18} />
            <span>Proceed to Checkout ({formatCurrency(totalAmount)})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
