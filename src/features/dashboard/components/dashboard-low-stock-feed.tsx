import { AlertTriangle, PackageSearch, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../../product/hooks/use-product';
import type { Product } from '../../../services/product';

function StockBadge({ product }: { product: Product }) {
  const qty = product.quantity ?? 0;
  const min = product.minStock ?? 0;

  if (qty <= 0) {
    return (
      <span className='inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-extrabold text-rose-700'>
        <span className='h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse inline-block' />
        Out of Stock
      </span>
    );
  }
  return (
    <span className='inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-800'>
      <span className='h-1.5 w-1.5 rounded-full bg-amber-400 inline-block' />
      Low ({qty}/{min})
    </span>
  );
}

export function DashboardLowStockFeed() {
  const navigate = useNavigate();
  const { useGetOutOfStockProducts, useGetLowStockProducts } = useProduct(true);
  const { data: outOfStock = [], isLoading: loadOut } = useGetOutOfStockProducts(5);
  const { data: lowStock = [], isLoading: loadLow } = useGetLowStockProducts(8);

  const combined: Product[] = [
    ...outOfStock,
    ...lowStock.filter((p) => !outOfStock.some((o) => o.id === p.id)),
  ].slice(0, 8);

  const isLoading = loadOut || loadLow;

  return (
    <div className='rounded-3xl border border-rose-200/60 bg-gradient-to-br from-rose-50/40 to-orange-50/20 p-5 sm:p-6 shadow-sm space-y-4'>
      <div className='flex items-center justify-between border-b border-rose-100 pb-4'>
        <div className='flex items-center gap-2.5'>
          <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600'>
            <AlertTriangle size={18} />
          </div>
          <div>
            <h2 className='font-extrabold text-slate-900 text-sm'>Restock Needed</h2>
            <p className='text-[11px] text-slate-500'>Products requiring immediate attention</p>
          </div>
        </div>
        <button
          type='button'
          onClick={() => navigate('/movement')}
          className='flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-sm hover:bg-rose-700 transition active:scale-95 cursor-pointer'
        >
          Add Stock <ArrowRight size={13} />
        </button>
      </div>

      {isLoading ? (
        <div className='space-y-2'>
          {new Array(4).fill(0).map((_, i) => (
            <div
              key={i}
              className='flex items-center justify-between rounded-2xl border border-rose-100/80 bg-white/40 px-3 py-2.5'
            >
              <div className='min-w-0 flex-1 space-y-1.5'>
                <div className='h-3 w-3/4 animate-pulse rounded-full bg-rose-200/60' />
                <div className='h-2.5 w-1/2 animate-pulse rounded-full bg-rose-100' />
              </div>
              <div className='h-5 w-16 animate-pulse rounded-full bg-rose-200/60' />
            </div>
          ))}
        </div>
      ) : combined.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-8 gap-2'>
          <PackageSearch size={32} className='text-emerald-400' />
          <p className='text-xs font-bold text-emerald-700'>All products are well-stocked!</p>
        </div>
      ) : (
        <div className='space-y-2'>
          {combined.map((p) => (
            <div
              key={p.id}
              className='flex items-center justify-between rounded-2xl border border-rose-100/80 bg-white/70 px-3 py-2.5 hover:bg-white transition'
            >
              <div className='min-w-0 flex-1'>
                <p className='text-xs font-bold text-slate-900 truncate'>{p.name}</p>
                <p className='text-[10px] text-slate-400 font-medium'>{p.category}</p>
              </div>
              <StockBadge product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
