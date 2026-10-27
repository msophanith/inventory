import { useState, useMemo } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '@/features/product/hooks/use-product';
import { useLanguage } from '@/i18n/language-context';
import { StockBadge } from './stock-badge';

type FeedFilter = 'ALL' | 'LOW' | 'OUT';

export function DashboardLowStockFeed() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FeedFilter>('ALL');
  const { useGetOutOfStockProducts, useGetLowStockProducts } = useProduct(true);
  const { data: outOfStock = [], isLoading: loadOut } =
    useGetOutOfStockProducts(15);
  const { data: lowStock = [], isLoading: loadLow } =
    useGetLowStockProducts(15);

  const displayedProducts = useMemo(() => {
    if (filter === 'OUT') return outOfStock.slice(0, 6);
    if (filter === 'LOW') return lowStock.slice(0, 6);

    if (outOfStock.length > 0 && lowStock.length > 0) {
      const takeOut = outOfStock.slice(0, 3);
      const takeLow = lowStock
        .filter((p) => !takeOut.some((o) => o.id === p.id))
        .slice(0, 3);
      return [...takeOut, ...takeLow];
    }
    return [...outOfStock, ...lowStock].slice(0, 6);
  }, [filter, outOfStock, lowStock]);

  const isLoading = loadOut || loadLow;

  return (
    <div className='flex h-full flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs transition hover:shadow-xs'>
      {/* Header */}
      <div className='flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200/60'>
            <AlertTriangle size={18} />
          </div>
          <div>
            <h2 className='text-sm sm:text-base font-black text-slate-900 tracking-tight'>
              {t('reports.restockNeeded')}
            </h2>
            <p className='text-xs text-slate-500 font-medium'>
              {t('reports.productsRequiringAttention')}
            </p>
          </div>
        </div>

        <button
          type='button'
          onClick={() => navigate('/products')}
          className='flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-slate-800 transition active:scale-95 cursor-pointer'
        >
          <span>{t('reports.restockItems')}</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className='mt-3 flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200/60 text-xs'>
        <button
          type='button'
          onClick={() => setFilter('ALL')}
          className={`flex-1 rounded-lg px-2 py-1 text-center font-bold transition-all cursor-pointer ${
            filter === 'ALL'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {t('common.all')} ({outOfStock.length + lowStock.length})
        </button>
        <button
          type='button'
          onClick={() => setFilter('LOW')}
          className={`flex-1 rounded-lg px-2 py-1 text-center font-bold transition-all cursor-pointer ${
            filter === 'LOW'
              ? 'bg-white text-amber-800 shadow-2xs'
              : 'text-slate-500 hover:text-amber-800'
          }`}
        >
          {t('products.lowStock')} ({lowStock.length})
        </button>
        <button
          type='button'
          onClick={() => setFilter('OUT')}
          className={`flex-1 rounded-lg px-2 py-1 text-center font-bold transition-all cursor-pointer ${
            filter === 'OUT'
              ? 'bg-white text-rose-800 shadow-2xs'
              : 'text-slate-500 hover:text-rose-800'
          }`}
        >
          {t('products.outOfStock')} ({outOfStock.length})
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className='space-y-2.5 pt-3'>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className='h-12 animate-pulse rounded-2xl bg-slate-100'
            />
          ))}
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-10 gap-2 text-center'>
          <CheckCircle2 size={32} className='text-emerald-500' />
          <p className='text-xs font-bold text-emerald-800'>
            {t('reports.allProductsWellStocked')}
          </p>
        </div>
      ) : (
        <div className='space-y-2 pt-3'>
          {displayedProducts.map((p) => (
            <div
              key={p.id}
              className='flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 px-3.5 py-2 transition hover:bg-slate-50 hover:border-slate-200'
            >
              <div className='min-w-0 flex-1 pr-3'>
                <p className='text-xs font-bold text-slate-900 truncate'>
                  {p.name}
                </p>
                <p className='text-[10px] font-medium text-slate-400'>
                  {p.category || 'General'}
                </p>
              </div>
              <StockBadge product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
