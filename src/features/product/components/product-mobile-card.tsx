import { ChevronRight, Package } from 'lucide-react';
import type { Product } from '@/services/product';
import { formatCurrencyUsd, formatCurrencyKhr } from '@/utils/currency';
import { formatDate } from '@/utils/date';

interface Props {
  readonly product: Product;
  readonly onClick?: () => void;
}

export function ProductMobileCard({ product, onClick }: Props) {
  const { quantity, minStock, unit, sellPrice, buyPrice } = product;

  let stockBadgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-200/60';
  let stockStatus = 'In Stock';
  if (quantity === 0) {
    stockBadgeStyle = 'bg-rose-100 text-rose-800 border-rose-200/60';
    stockStatus = 'Out of Stock';
  } else if (quantity <= minStock) {
    stockBadgeStyle = 'bg-amber-100 text-amber-800 border-amber-200/60';
    stockStatus = 'Low Stock';
  }

  return (
    <div
      onClick={onClick}
      className='group cursor-pointer rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs hover:border-indigo-300 hover:shadow-md active:scale-[0.99] transition-all flex flex-col gap-2.5'
    >
      {/* Top: Image, Name, Barcode & Category */}
      <div className='flex items-start gap-3 min-w-0'>
        <div className='h-12 w-12 rounded-xl border border-slate-200/80 bg-slate-100 shrink-0 overflow-hidden flex items-center justify-center'>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className='h-full w-full object-cover'
            />
          ) : (
            <Package size={20} className='text-slate-400' />
          )}
        </div>

        <div className='min-w-0 flex-1'>
          <div className='flex items-center justify-between gap-1.5'>
            <p className='font-bold text-slate-900 text-sm truncate group-hover:text-indigo-600 transition-colors'>
              {product.name}
            </p>
            <span className='rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 shrink-0'>
              {product.category || 'General'}
            </span>
          </div>
          <p className='text-xs text-slate-400 font-mono mt-0.5 truncate'>
            {product.barcode || `#${product.id}`}
          </p>
        </div>
      </div>

      {/* Middle: Stock & Pricing Grid */}
      <div className='grid grid-cols-2 gap-2'>
        {/* Stock Status Tile */}
        <div className='rounded-xl bg-slate-50 p-2.5 flex flex-col justify-between'>
          <div className='flex items-center justify-between'>
            <span className='text-[10px] font-bold uppercase tracking-wider text-slate-400'>
              Stock
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-black ${stockBadgeStyle}`}
            >
              {stockStatus}
            </span>
          </div>
          <p className='text-sm font-black text-slate-900 mt-1'>
            {quantity}{' '}
            <span className='text-xs font-semibold text-slate-500'>
              {unit || 'units'}
            </span>
          </p>
        </div>

        {/* Price Tile (USD + KHR) */}
        <div className='rounded-xl bg-slate-50 p-2.5 flex flex-col justify-between'>
          <span className='text-[10px] font-bold uppercase tracking-wider text-slate-400'>
            Sell Price
          </span>
          <div className='mt-1'>
            <p className='text-sm font-black text-slate-900'>
              {formatCurrencyUsd(sellPrice)}
            </p>
            <p className='text-[10px] font-bold text-slate-400'>
              {formatCurrencyKhr(sellPrice)}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Cost info & Created date */}
      <div className='flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-400 font-medium'>
        <span>Cost: {formatCurrencyUsd(buyPrice)}</span>
        <div className='flex items-center gap-1 group-hover:text-indigo-600 transition-colors'>
          <span>{formatDate(product.createdAt, 'DD MMM YYYY')}</span>
          <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
}
