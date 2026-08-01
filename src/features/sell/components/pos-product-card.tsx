import { Package, Plus } from 'lucide-react';
import type { Product } from '../../../services/product';

interface Props {
  readonly product: Product;
  readonly cartQuantity: number;
  readonly onAddToCart: (product: Product) => void;
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(val);

export function PosProductCard({ product, cartQuantity, onAddToCart }: Props) {
  const isOutOfStock = product.quantity <= 0;
  const remainingStock = product.quantity - cartQuantity;

  return (
    <div
      onClick={() => !isOutOfStock && onAddToCart(product)}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-xs transition-all duration-200 ${
        isOutOfStock
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:-translate-y-1 hover:shadow-lg hover:border-emerald-300 cursor-pointer'
      }`}
    >
      {/* Product Image or Icon */}
      <div className='relative flex h-32 w-full items-center justify-center rounded-2xl bg-slate-100 overflow-hidden'>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
          />
        ) : (
          <Package size={36} className='text-slate-400' />
        )}

        {/* Stock Badge */}
        <span
          className={`absolute top-2.5 right-2.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
            isOutOfStock
              ? 'bg-rose-500 text-white'
              : remainingStock <= product.minStock
              ? 'bg-amber-500 text-white'
              : 'bg-slate-900/80 text-white backdrop-blur-xs'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : `${remainingStock} left`}
        </span>

        {/* Cart Count Badge */}
        {cartQuantity > 0 && (
          <span className='absolute bottom-2.5 left-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-extrabold text-white shadow-md'>
            {cartQuantity}
          </span>
        )}
      </div>

      {/* Details */}
      <div className='mt-3 space-y-1'>
        <p className='text-xs font-medium text-slate-400 uppercase tracking-wider'>
          {product.category || 'General'}
        </p>
        <h3 className='font-bold text-slate-900 line-clamp-1 text-sm'>
          {product.name}
        </h3>
        <div className='flex items-center justify-between pt-1'>
          <span className='text-base font-extrabold text-emerald-600'>
            {formatCurrency(product.sellPrice)}
          </span>
          <button
            disabled={isOutOfStock || remainingStock <= 0}
            className='flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-emerald-600 group-hover:text-white disabled:opacity-50'
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
