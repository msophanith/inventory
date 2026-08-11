import { memo } from 'react';
import { Package, Plus } from 'lucide-react';
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
  const isLowStock = remainingStock <= (product.minStock || 0);

  let stockBadgeStyle = 'bg-slate-900/80 text-white backdrop-blur-md';
  if (isDisabled) {
    stockBadgeStyle = 'bg-rose-600 text-white shadow-xs';
  } else if (isLowStock) {
    stockBadgeStyle = 'bg-amber-500 text-white shadow-xs';
  }

  return (
    <button
      type='button'
      disabled={isDisabled}
      onClick={() => onAddToCart(product)}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-3.5 shadow-xs transition-all duration-300 text-left w-full ${
        isDisabled
          ? 'opacity-55 cursor-not-allowed grayscale'
          : 'hover:-translate-y-1.5 hover:shadow-xl hover:border-indigo-400/80 hover:bg-white cursor-pointer active:scale-98'
      }`}
    >
      {/* Product Image & Badges */}
      <div className='relative flex h-32 w-full items-center justify-center rounded-2xl bg-slate-100/80 overflow-hidden shadow-inner'>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
          />
        ) : (
          <Package
            size={36}
            className='text-slate-400 group-hover:scale-110 transition-transform duration-300'
          />
        )}

        {/* Stock Badge */}
        <span
          className={`absolute top-2 right-2 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${stockBadgeStyle}`}
        >
          {isDisabled ? 'Out of Stock' : `${remainingStock} left`}
        </span>

        {/* Cart Count Pill */}
        {cartQuantity > 0 && (
          <span className='absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-black text-white shadow-lg ring-2 ring-white animate-in zoom-in-75 duration-150'>
            {cartQuantity}
          </span>
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
            className={`flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white shadow-xs shrink-0 ${
              isDisabled ? 'opacity-40' : ''
            }`}
          >
            <Plus size={16} />
          </span>
        </div>
      </div>
    </button>
  );
});
