import { BarChart3, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../i18n/language-context';

interface Props {
  readonly totalItems: number;
  readonly lowStock: number;
  readonly outOfStock: number;
}

export function DashboardStockDistribution({
  totalItems,
  lowStock,
  outOfStock,
}: Props) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const healthyCount = Math.max(0, totalItems - (lowStock + outOfStock));
  const healthyPct =
    totalItems > 0 ? Math.round((healthyCount / totalItems) * 100) : 0;
  const lowPct =
    totalItems > 0 ? Math.round((lowStock / totalItems) * 100) : 0;
  const outPct =
    totalItems > 0 ? Math.round((outOfStock / totalItems) * 100) : 0;

  return (
    <div className='flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs transition hover:shadow-md'>
      {/* Header */}
      <div>
        <div className='flex items-center justify-between border-b border-slate-100 pb-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100'>
              <BarChart3 size={20} />
            </div>
            <div>
              <h2 className='text-sm sm:text-base font-extrabold text-slate-900'>
                {t('reports.stockDistribution')}
              </h2>
              <p className='text-xs text-slate-500 font-medium'>
                {t('reports.stockDistributionDesc')}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${
              healthyPct >= 80
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                : 'bg-amber-50 text-amber-700 border border-amber-200/60'
            }`}
          >
            {healthyPct >= 80 ? (
              <CheckCircle2 size={13} className='text-emerald-500' />
            ) : (
              <ShieldAlert size={13} className='text-amber-500' />
            )}
            {healthyPct}% {t('reports.healthy')}
          </span>
        </div>

        {/* Segmented Progress Bar */}
        <div className='mt-6 space-y-2'>
          <div className='flex h-3.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 shadow-inner'>
            <div
              style={{ width: `${healthyPct}%` }}
              className='h-full rounded-full bg-emerald-500 transition-all duration-700'
              title={`Healthy: ${healthyCount} (${healthyPct}%)`}
            />
            <div
              style={{ width: `${lowPct}%` }}
              className='h-full bg-amber-400 transition-all duration-700'
              title={`Low: ${lowStock} (${lowPct}%)`}
            />
            <div
              style={{ width: `${outPct}%` }}
              className='h-full rounded-r-full bg-rose-500 transition-all duration-700'
              title={`Out: ${outOfStock} (${outPct}%)`}
            />
          </div>

          <div className='flex items-center justify-between text-[11px] font-semibold text-slate-400 px-1'>
            <span>0%</span>
            <span>{totalItems} total catalog units</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className='mt-6 grid grid-cols-3 gap-2.5'>
        {/* Healthy */}
        <div className='rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3 text-center transition hover:bg-emerald-50/70'>
          <span className='inline-block h-2 w-2 rounded-full bg-emerald-500 mb-1' />
          <p className='text-sm sm:text-base font-black text-slate-900'>
            {healthyCount}
          </p>
          <p className='text-[10px] sm:text-xs font-bold text-emerald-700 mt-0.5 truncate'>
            {t('reports.inStock')} ({healthyPct}%)
          </p>
        </div>

        {/* Low Stock */}
        <div
          onClick={() => navigate('/products')}
          className='cursor-pointer rounded-2xl border border-amber-100 bg-amber-50/40 p-3 text-center transition hover:bg-amber-50/70 active:scale-95'
        >
          <span className='inline-block h-2 w-2 rounded-full bg-amber-400 mb-1' />
          <p className='text-sm sm:text-base font-black text-amber-950'>
            {lowStock}
          </p>
          <p className='text-[10px] sm:text-xs font-bold text-amber-700 mt-0.5 truncate'>
            {t('reports.lowStockCount')} ({lowPct}%)
          </p>
        </div>

        {/* Out of Stock */}
        <div
          onClick={() => navigate('/products')}
          className='cursor-pointer rounded-2xl border border-rose-100 bg-rose-50/40 p-3 text-center transition hover:bg-rose-50/70 active:scale-95'
        >
          <span className='inline-block h-2 w-2 rounded-full bg-rose-500 mb-1' />
          <p className='text-sm sm:text-base font-black text-rose-950'>
            {outOfStock}
          </p>
          <p className='text-[10px] sm:text-xs font-bold text-rose-700 mt-0.5 truncate'>
            {t('reports.outOfStockCount')} ({outPct}%)
          </p>
        </div>
      </div>
    </div>
  );
}
