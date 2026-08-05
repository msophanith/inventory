import { AlertOctagon, ArrowUpRight, ChevronRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../../services/product';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';

interface Props {
  readonly products: Product[];
}

export function OutOfStockCard({ products }: Props) {
  return (
    <div className='flex flex-col space-y-3 sm:space-y-4 rounded-2xl sm:rounded-3xl border border-rose-200/60 bg-white p-4 sm:p-6 shadow-sm transition-all hover:shadow-md'>
      {/* Card Header */}
      <div className='flex items-center justify-between border-b border-rose-100 pb-3 sm:pb-4'>
        <div className='flex items-center gap-2.5 sm:gap-3'>
          <div className='flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-rose-50 text-rose-600 shadow-2xs ring-2 sm:ring-4 ring-rose-50/50 shrink-0'>
            <AlertOctagon className='h-5 w-5 sm:h-6 sm:w-6' />
          </div>
          <div>
            <div className='flex items-center gap-1.5 sm:gap-2'>
              <h3 className='text-sm sm:text-lg font-bold text-slate-900'>Out of Stock</h3>
              <span className='rounded-full bg-rose-100 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-rose-700'>
                {products.length}
              </span>
            </div>
            <p className='text-[11px] sm:text-xs text-slate-500 font-medium hidden sm:block'>
              Critical stock depletion (Max 10 listed)
            </p>
          </div>
        </div>

        <Link
          to='/products'
          className='flex items-center gap-1 rounded-xl bg-slate-50 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-bold text-slate-600 transition hover:bg-rose-50 hover:text-rose-600 cursor-pointer shrink-0'
        >
          <span>All</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Table / List */}
      <div className='flex-1 overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-100'>
        {products.length === 0 ? (
          <div className='flex flex-col items-center justify-center p-6 text-center space-y-1.5 bg-emerald-50/40 rounded-xl'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600'>
              <ShieldCheck size={18} />
            </div>
            <p className='text-xs sm:text-sm font-bold text-emerald-900'>Zero Out of Stock Items!</p>
            <p className='text-[11px] text-emerald-700/80 font-medium'>
              All products currently have inventory.
            </p>
          </div>
        ) : (
          <table className='w-full border-collapse text-left text-xs'>
            <thead>
              <tr className='border-b border-slate-200 bg-slate-50/80 font-bold uppercase tracking-wider text-slate-500 text-[10px] sm:text-xs'>
                <th className='px-3 py-2.5 sm:px-4 sm:py-3'>Product</th>
                <th className='px-3 py-2.5 sm:px-4 sm:py-3 text-right'>Price</th>
                <th className='px-3 py-2.5 sm:px-4 sm:py-3 text-center'>Status</th>
                <th className='px-3 py-2.5 sm:px-4 sm:py-3 text-right'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {products.slice(0, 10).map((product) => (
                <tr key={product.id} className='transition hover:bg-rose-50/30'>
                  <td className='px-3 py-2.5 sm:px-4 sm:py-3.5'>
                    <p className='font-bold text-slate-900 max-w-[120px] sm:max-w-[160px] truncate'>
                      {product.name}
                    </p>
                    <span className='inline-block rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-slate-600'>
                      {product.category || 'General'}
                    </span>
                  </td>

                  <td className='px-3 py-2.5 sm:px-4 sm:py-3.5 text-right'>
                    <span className='block font-black text-slate-900 text-xs'>{formatCurrencyUsd(product.sellPrice)}</span>
                    <span className='block font-bold text-indigo-600 text-[10px]'>{formatCurrencyKhr(product.sellPrice)}</span>
                  </td>

                  <td className='px-3 py-2.5 sm:px-4 sm:py-3.5 text-center'>
                    <span className='inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold text-rose-700'>
                      0 {product.unit || 'units'}
                    </span>
                  </td>

                  <td className='px-3 py-2.5 sm:px-4 sm:py-3.5 text-right'>
                    <Link
                      to={`/products/${product.id}`}
                      className='inline-flex items-center gap-1 rounded-lg sm:rounded-xl bg-slate-100 px-2 py-1 sm:px-2.5 sm:py-1.5 text-[10px] sm:text-[11px] font-bold text-slate-700 transition hover:bg-indigo-600 hover:text-white'
                    >
                      <span>View</span>
                      <ArrowUpRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
