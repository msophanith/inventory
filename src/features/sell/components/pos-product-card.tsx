import { memo } from 'react';
import { Package, Plus } from 'lucide-react';
import type { Product } from '../../../services/product';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';
import { PosProductBadge } from './pos-product-badge';

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
  const lowThreshold = product.minStock && product.minStock > 0 ? product.minStock : 5;
  const isLowStock = !isOutOfStock && remainingStock > 0 && remainingStock <= lowThreshold;
  const isMaxInCart = !isOutOfStock && cartQuantity > 0 && remainingStock <= 0;

  let cardBorderStyle = 'border-slate-200/80 bg-white/90 hover:border-indigo-400/80';
  let plusIconStyle = 'bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white';

  if (isDisabled) {
    cardBorderStyle = 'border-rose-200 bg-slate-50/90 opacity-60 cursor-not-allowed grayscale-[30%]';
    plusIconStyle = 'bg-slate-200 text-slate-400 opacity-50';
  } else if (isLowStock) {
    cardBorderStyle = 'border-amber-300/90 bg-amber-50/30 hover:border-amber-400 shadow-amber-100/50';
    plusIconStyle = 'bg-amber-500 text-white group-hover:bg-amber-600';
  }

  return (
    <button
      type='button'
      disabled={isDisabled}
      onClick={() => onAddToCart(product)}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-2.5 sm:p-3.5 shadow-xs transition-all duration-200 text-left w-full ${cardBorderStyle} ${
        isDisabled ? '' : 'hover:-translate-y-1 hover:shadow-lg hover:bg-white cursor-pointer active:scale-98'
      }`}
    >
      {/* Product Image & Badges */}
      <div className='relative flex h-28 sm:h-32 w-full items-center justify-center rounded-2xl bg-slate-100/80 overflow-hidden shadow-inner'>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`h-full w-full object-cover transition-transform duration-300 ${isDisabled ? '' : 'group-hover:scale-105'}`}
          />
        ) : (
          <Package size={32} className='text-slate-400' />
        )}

        <div className='absolute top-1.5 right-1.5 z-10'>
          <PosProductBadge
            isOutOfStock={isOutOfStock}
            isMaxInCart={isMaxInCart}
            isLowStock={isLowStock}
            remainingStock={remainingStock}
          />
        </div>

        {cartQuantity > 0 && (
          <span className='absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-black text-white shadow-md ring-2 ring-white z-10'>
            <span>Cart:</span>
            <span className='rounded-full bg-white px-1 text-[9px] text-emerald-700 font-extrabold'>{cartQuantity}</span>
          </span>
        )}

        {isOutOfStock && (
          <div className='absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center'>
            <span className='px-2.5 py-0.5 rounded-xl bg-rose-600/90 text-white font-black text-[10px] uppercase tracking-wider shadow-lg'>
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Name & Dual Pricing */}
      <div className='mt-2.5 space-y-1'>
        <p className='text-[9px] font-extrabold text-slate-400 uppercase tracking-widest truncate'>
          {product.category}
        </p>
        <h3 className='font-extrabold text-slate-900 line-clamp-1 text-xs leading-snug group-hover:text-indigo-600 transition-colors'>
          {product.name}
        </h3>
        {product.barcode && (
          <span className='text-[9px] font-mono text-slate-400 truncate block tracking-wide'>
            #{product.barcode}
          </span>
        )}

        <div className='flex items-center justify-between pt-1'>
          <div className='min-w-0'>
            <span className='text-xs sm:text-sm font-black text-emerald-600 block leading-none truncate'>
              {formatCurrencyUsd(product.sellPrice)}
            </span>
            <span className='text-[9px] font-bold text-slate-500 block mt-0.5 truncate'>
              {formatCurrencyKhr(product.sellPrice)}
            </span>
          </div>

          <span
            aria-hidden='true'
            className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl transition shadow-2xs shrink-0 ${plusIconStyle}`}
          >
            <Plus size={14} />
          </span>
        </div>
      </div>
    </button>
  );
});
