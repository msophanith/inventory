import { Trash2, X, ReceiptText, CreditCard } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';
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
  readonly onSetExactQty?: (productId: string, exactQty: number) => void;
  readonly onUpdatePrice: (productId: string, newPrice: number) => void;
  readonly onUpdateUnit: (productId: string, newUnit: string) => void;
  readonly onRemoveItem: (productId: string) => void;
  readonly onClearCart: () => void;
  readonly onCheckout: () => void;
  readonly onStockExceeded?: (productName: string, maxStock: number) => void;
}

const formatCurrencyUsd = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

export function PosMobileCartDrawer({
  open,
  items,
  subtotal,
  tax,
  totalAmount,
  onClose,
  onUpdateQty,
  onSetExactQty,
  onUpdatePrice,
  onUpdateUnit,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onStockExceeded,
}: Props) {
  const { t } = useLanguage();
  if (!open) return null;

  return (
    <div className='lg:hidden fixed inset-0 z-50 flex flex-col justify-end'>
      <button
        type='button'
        aria-label='Close drawer'
        className='fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 border-none'
        onClick={onClose}
      />

      <div className='relative z-10 w-full max-h-[85vh] rounded-t-3xl bg-white p-5 shadow-2xl space-y-4 flex flex-col animate-in slide-in-from-bottom duration-200'>
        <div className='flex items-center justify-between border-b border-slate-100 pb-3.5'>
          <div className='flex items-center gap-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600'><ReceiptText size={18} /></div>
            <h2 className='font-extrabold text-slate-900 text-base'>{t('pos.currentOrder')}</h2>
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

        <div className='flex-1 overflow-y-auto space-y-2.5 max-h-90 pr-1'>
          {items.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-10 opacity-50'>
              <ReceiptText size={48} className='text-slate-300 mb-3' />
              <p className='text-xs font-bold text-slate-500'>{t('pos.cartEmpty')}</p>
            </div>
          ) : (
            items.map((item) => (
              <PosCartItem
                key={item.product.id}
                item={item}
                onUpdateQty={onUpdateQty}
                onSetExactQty={onSetExactQty || ((id, qty) => onUpdateQty(id, qty - item.quantity))}
                onUpdatePrice={onUpdatePrice}
                onUpdateUnit={onUpdateUnit}
                onRemove={onRemoveItem}
                onStockExceeded={onStockExceeded}
              />
            ))
          )}
        </div>

        <div className='border-t border-slate-100 pt-3.5 space-y-3'>
          <div className='space-y-1 text-xs text-slate-600 font-semibold'>
            <div className='flex justify-between font-bold text-slate-600'>
              <span>{t('pos.subtotal')}</span>
              <span>{formatCurrencyUsd(subtotal)}</span>
            </div>
            {tax > 0 && (
              <div className='flex justify-between font-bold text-rose-500'>
                <span>{t('pos.tax')}</span>
                <span>+{formatCurrencyUsd(tax)}</span>
              </div>
            )}
            <div className='flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200 mt-2'>
              <span>{t('pos.totalPayable')}</span>
              <span className='text-emerald-600'>{formatCurrencyUsd(totalAmount)}</span>
            </div>
          </div>

          <button
            disabled={items.length === 0}
            onClick={() => {
              onClose();
              onCheckout();
            }}
            className='flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-black text-white shadow-xl shadow-emerald-600/20 active:scale-98 transition disabled:opacity-50 cursor-pointer'
          >
            <CreditCard size={18} />
            <span>Proceed to Checkout ({formatCurrencyUsd(totalAmount)})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
