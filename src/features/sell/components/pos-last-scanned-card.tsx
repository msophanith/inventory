import { CheckCircle2, Minus, Package, Plus, X } from 'lucide-react';
import { useLanguage } from '@/i18n/language-context';
import type { Product } from '@/services/product';
import { formatCurrencyKhr, formatCurrencyUsd } from '@/utils/currency';

interface Props {
  readonly product: Product;
  readonly cartQuantity: number;
  readonly onUpdateQty: (productId: string, delta: number) => void;
  readonly onStockExceeded?: (productName: string, maxStock: number) => void;
  readonly onDismiss: () => void;
}

export function PosLastScannedCard({
  product,
  cartQuantity,
  onUpdateQty,
  onStockExceeded,
  onDismiss,
}: Props) {
  const { t } = useLanguage();

  const isLowStock = product.quantity <= (product.minStock || 5);
  const isOutOfStock = product.quantity <= 0;

  const handleIncrement = () => {
    if (cartQuantity >= product.quantity) {
      onStockExceeded?.(product.name, product.quantity);
      return;
    }
    onUpdateQty(product.id, 1);
  };

  const handleDecrement = () => {
    if (cartQuantity > 0) {
      onUpdateQty(product.id, -1);
    }
  };

  return (
    <div className='relative overflow-hidden rounded-3xl border border-emerald-200/90 bg-linear-to-br from-emerald-50/50 via-white to-teal-50/30 p-4 sm:p-5 shadow-lg shadow-emerald-600/5 space-y-3.5 animate-in fade-in slide-in-from-bottom-2 duration-200'>
      {/* Top Meta Bar */}
      <div className='flex items-center justify-between'>
        <div className='inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-emerald-800 text-[11px] font-extrabold'>
          <span className='h-2 w-2 rounded-full bg-emerald-500 animate-pulse' />
          <CheckCircle2 size={12} className='text-emerald-600' />
          <span>{t('pos.lastScanned')}</span>
        </div>

        <button
          type='button'
          onClick={onDismiss}
          className='rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer'
        >
          <X size={16} />
        </button>
      </div>

      {/* Main Product Info */}
      <div className='flex items-start gap-3.5'>
        <div className='relative flex h-18 w-18 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-white border border-slate-200/80 overflow-hidden shrink-0 shadow-inner'>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className='h-full w-full object-cover' />
          ) : (
            <Package size={30} className='text-slate-400' />
          )}
        </div>

        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-1.5 flex-wrap'>
            <span className='rounded-lg bg-indigo-50 px-2 py-0.5 text-[10px] font-extrabold text-indigo-700 uppercase tracking-wide'>
              {product.category || 'General'}
            </span>
            <span className='rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-600'>
              {product.barcode || product.id}
            </span>
          </div>

          <h3 className='mt-1 text-base sm:text-lg font-black text-slate-900 leading-snug truncate'>
            {product.name}
          </h3>

          {/* Dual Currency Price Display */}
          <div className='mt-1 flex items-baseline gap-2 flex-wrap'>
            <span className='text-xl font-black text-emerald-600'>
              {formatCurrencyUsd(product.sellPrice)}
            </span>
            <span className='text-xs font-bold text-indigo-600'>
              {formatCurrencyKhr(product.sellPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Stock status & Quick Quantity Controls */}
      <div className='flex items-center justify-between pt-2 border-t border-emerald-100/70'>
        <div className='flex items-center gap-1.5'>
          <span className='text-xs font-bold text-slate-500'>{t('pos.remainingStock')}:</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
              isOutOfStock
                ? 'bg-rose-100 text-rose-700'
                : isLowStock
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {product.quantity} {product.unit || 'units'}
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <span className='text-xs font-extrabold text-slate-700'>
            {t('pos.inCartCount', { count: cartQuantity })}
          </span>
          <div className='flex items-center gap-1 rounded-xl bg-white border border-slate-200 p-0.5 shadow-2xs'>
            <button
              type='button'
              onClick={handleDecrement}
              disabled={cartQuantity <= 0}
              className='flex h-6 w-6 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer transition'
            >
              <Minus size={12} />
            </button>
            <button
              type='button'
              onClick={handleIncrement}
              disabled={isOutOfStock || cartQuantity >= product.quantity}
              className='flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-30 cursor-pointer transition shadow-2xs'
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

