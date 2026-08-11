import { memo } from 'react';
import { AlertTriangle, Ban, Package, Plus } from 'lucide-react';
import type { Product } from '../../../services/product';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';

interface Props {
  readonly product: Product;
  readonly cartQuantity: number;
  readonly onAddToCart: (product: Product) => void;
}

export const PosProductCard = memo(function PosProductCard({
  product,
  cartQuantity,
  onAddToCart,
}: Props) {
  const isOutOfStock = product.quantity <= 0;
  const remainingStock = product.quantity - cartQuantity;

  const isDisabled = isOutOfStock || remainingStock <= 0;
  const lowThreshold =
    product.minStock && product.minStock > 0 ? product.minStock : 5;
  const isLowStock =
    !isOutOfStock && remainingStock > 0 && remainingStock <= lowThreshold;
  const isMaxInCart = !isOutOfStock && cartQuantity > 0 && remainingStock <= 0;

  let cardBorderStyle =
    'border-slate-200/80 bg-white/90 hover:border-indigo-400/80';
  let plusIconStyle =
    'bg-slate-100 text-slate-700 group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white';

  if (isDisabled) {
    cardBorderStyle =
      'border-rose-200 bg-slate-50/90 opacity-60 cursor-not-allowed grayscale-[30%]';
    plusIconStyle = 'bg-slate-200 text-slate-400 opacity-50';
  } else if (isLowStock) {
    cardBorderStyle =
      'border-amber-300/90 bg-amber-50/30 hover:border-amber-400 shadow-amber-100/50';
    plusIconStyle = 'bg-amber-500 text-white group-hover:bg-amber-600';
  }

  const renderStatusBadge = () => {
    const badgeBase =
      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md';

    if (isOutOfStock) {
      return (
        <span
          className={`${badgeBase} bg-rose-600 backdrop-blur-md ring-1 ring-white/30 animate-pulse`}
        >
          <Ban size={11} strokeWidth={2.5} /> Out of Stock
        </span>
      );
    }
    if (isMaxInCart) {
      return (
        <span className={`${badgeBase} bg-rose-500`}>
          <Ban size={11} strokeWidth={2.5} /> Max In Cart
        </span>
      );
    }
    if (isLowStock) {
      return (
        <span className={`${badgeBase} bg-amber-500 ring-1 ring-white/40`}>
          <AlertTriangle size={11} strokeWidth={2.5} /> Low: {remainingStock}{' '}
          left
        </span>
      );
    }
    return (
      <span className='inline-flex items-center rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-md shadow-xs'>
        {remainingStock} in stock
      </span>
    );
  };

  return (
    <button
      type='button'
      disabled={isDisabled}
      onClick={() => onAddToCart(product)}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-3.5 shadow-xs transition-all duration-300 text-left w-full ${cardBorderStyle} ${
        isDisabled
          ? ''
          : 'hover:-translate-y-1.5 hover:shadow-xl hover:bg-white cursor-pointer active:scale-98'
      }`}
    >
      {/* Product Image & Badges */}
      <div className='relative flex h-32 w-full items-center justify-center rounded-2xl bg-slate-100/80 overflow-hidden shadow-inner'>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`h-full w-full object-cover transition-transform duration-500 ${
              isDisabled ? '' : 'group-hover:scale-110'
            }`}
          />
        ) : (
          <Package
            size={36}
            className='text-slate-400 group-hover:scale-110 transition-transform duration-300'
          />
        )}

        {/* Status Visual Pill */}
        <div className='absolute top-2 right-2 flex flex-col items-end gap-1 z-10'>
          {renderStatusBadge()}
        </div>

        {/* In Cart Count Pill */}
        {cartQuantity > 0 && (
          <span className='absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white shadow-lg ring-2 ring-white animate-in zoom-in-75 duration-150 z-10'>
            <span>In Cart:</span>
            <span className='rounded-full bg-white px-1.5 py-0.2 text-[10px] text-emerald-700 font-extrabold'>
              {cartQuantity}
            </span>
          </span>
        )}

        {/* Frosted Glass Banner for Out of Stock */}
        {isOutOfStock && (
          <div className='absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center'>
            <span className='px-3 py-1 rounded-xl bg-rose-600/90 text-white font-black text-xs uppercase tracking-widest border border-white/20 shadow-xl'>
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Name & Dual Pricing */}
      <div className='mt-3 space-y-1'>
        <p className='text-[10px] font-extrabold text-slate-400 uppercase tracking-widest truncate'>
          {product.category || 'General'}
        </p>
        <h3 className='font-extrabold text-slate-900 line-clamp-1 text-xs leading-snug group-hover:text-indigo-600 transition-colors'>
          {product.name}
        </h3>

        <div className='flex items-center justify-between pt-1'>
          <div>
            <span className='text-sm font-black text-emerald-600 block leading-none'>
              {formatCurrencyUsd(product.sellPrice)}
            </span>
            <span className='text-[10px] font-bold text-indigo-600 block mt-0.5'>
              {formatCurrencyKhr(product.sellPrice)}
            </span>
          </div>

          <span
            aria-hidden='true'
            className={`flex h-8 w-8 items-center justify-center rounded-xl transition shadow-xs shrink-0 ${plusIconStyle}`}
          >
            <Plus size={16} />
          </span>
        </div>
      </div>
    </button>
  );
});
