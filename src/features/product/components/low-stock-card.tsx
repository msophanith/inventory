import { AlertTriangle, ArrowUpRight, ChevronRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../../services/product';

interface Props {
  readonly products: Product[];
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);

export function LowStockCard({ products }: Props) {
  return (
    <div className='flex flex-col space-y-4 rounded-3xl border border-amber-200/60 bg-white p-6 shadow-sm transition-all hover:shadow-md'>
      {/* Card Header */}
      <div className='flex items-center justify-between border-b border-amber-100 pb-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-2xs ring-4 ring-amber-50/50'>
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <h3 className='text-lg font-bold text-slate-900'>Low Stock Alerts</h3>
              <span className='rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800'>
                {products.length}
              </span>
            </div>
            <p className='text-xs text-slate-500 font-medium'>
              Items below min stock threshold (Max 10 listed)
            </p>
          </div>
        </div>

        <Link
          to='/products'
          className='flex items-center gap-1 rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-amber-50 hover:text-amber-700 cursor-pointer'
        >
          <span>View All</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Table / List */}
      <div className='flex-1 overflow-x-auto rounded-2xl border border-slate-100'>
        {products.length === 0 ? (
          <div className='flex flex-col items-center justify-center p-8 text-center space-y-2 bg-emerald-50/40 rounded-2xl'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600'>
              <Package size={20} />
            </div>
            <p className='text-sm font-bold text-emerald-900'>Stock Levels Healthy!</p>
            <p className='text-xs text-emerald-700/80 font-medium'>
              No items are currently below minimum stock thresholds.
            </p>
          </div>
        ) : (
          <table className='w-full border-collapse text-left text-xs'>
            <thead>
              <tr className='border-b border-slate-200 bg-slate-50/80 font-bold uppercase tracking-wider text-slate-500'>
                <th className='px-4 py-3'>Product</th>
                <th className='px-4 py-3 text-right'>Sell Price</th>
                <th className='px-4 py-3 text-center'>Stock / Min</th>
                <th className='px-4 py-3 text-right'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {products.slice(0, 10).map((product) => (
                <tr key={product.id} className='transition hover:bg-amber-50/30'>
                  <td className='px-4 py-3.5'>
                    <p className='font-bold text-slate-900 max-w-[160px] truncate'>
                      {product.name}
                    </p>
                    <span className='inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600'>
                      {product.category || 'General'}
                    </span>
                  </td>

                  <td className='px-4 py-3.5 text-right font-bold text-slate-800'>
                    {formatCurrency(product.sellPrice)}
                  </td>

                  <td className='px-4 py-3.5 text-center'>
                    <span className='inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-extrabold text-amber-800'>
                      {product.quantity} / {product.minStock} {product.unit || 'units'}
                    </span>
                  </td>

                  <td className='px-4 py-3.5 text-right'>
                    <Link
                      to={`/products/${product.id}`}
                      className='inline-flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 transition hover:bg-indigo-600 hover:text-white'
                    >
                      <span>Manage</span>
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
