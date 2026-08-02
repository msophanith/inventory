import { BarChart3, PieChart, ShieldAlert, Sparkles } from 'lucide-react';
import { formatCurrencyUsd } from '../../../utils/currency';

interface Props {
  readonly totalItems: number;
  readonly lowStock: number;
  readonly outOfStock: number;
  readonly totalValue: number;
}

export function DashboardAnalyticsCharts({
  totalItems,
  lowStock,
  outOfStock,
  totalValue,
}: Props) {
  const healthyCount = Math.max(0, totalItems - (lowStock + outOfStock));

  const healthyPct = totalItems > 0 ? Math.round((healthyCount / totalItems) * 100) : 0;
  const lowPct = totalItems > 0 ? Math.round((lowStock / totalItems) * 100) : 0;
  const outPct = totalItems > 0 ? Math.round((outOfStock / totalItems) * 100) : 0;

  return (
    <div className='grid grid-cols-1 gap-5 lg:grid-cols-3'>
      {/* 1. Inventory Health Distribution (2 Cols) */}
      <div className='lg:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-4'>
        <div className='flex items-center justify-between border-b border-slate-100 pb-3.5'>
          <div className='flex items-center gap-2.5'>
            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600'>
              <BarChart3 size={18} />
            </div>
            <div>
              <h2 className='font-extrabold text-slate-900 text-base'>Stock Level Distribution</h2>
              <p className='text-xs text-slate-500 font-medium'>
                Catalog health ratio across stock levels
              </p>
            </div>
          </div>
          <span className='rounded-xl bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700'>
            {healthyPct}% Healthy
          </span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className='space-y-2 pt-2'>
          <div className='flex h-4 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner'>
            <div
              style={{ width: `${healthyPct}%` }}
              className='bg-emerald-500 transition-all duration-500'
              title={`Healthy: ${healthyCount} items (${healthyPct}%)`}
            />
            <div
              style={{ width: `${lowPct}%` }}
              className='bg-amber-400 transition-all duration-500'
              title={`Low Stock: ${lowStock} items (${lowPct}%)`}
            />
            <div
              style={{ width: `${outPct}%` }}
              className='bg-rose-500 transition-all duration-500'
              title={`Out of Stock: ${outOfStock} items (${outPct}%)`}
            />
          </div>

          {/* Legend Items */}
          <div className='grid grid-cols-3 gap-2 pt-3 text-center'>
            <div className='rounded-2xl border border-slate-100 bg-slate-50/70 p-3'>
              <span className='inline-block h-2 w-2 rounded-full bg-emerald-500 mb-1' />
              <p className='text-xs font-extrabold text-slate-900'>{healthyCount} Items</p>
              <p className='text-[11px] font-semibold text-slate-400'>In Stock ({healthyPct}%)</p>
            </div>

            <div className='rounded-2xl border border-amber-100 bg-amber-50/40 p-3'>
              <span className='inline-block h-2 w-2 rounded-full bg-amber-400 mb-1' />
              <p className='text-xs font-extrabold text-amber-900'>{lowStock} Items</p>
              <p className='text-[11px] font-semibold text-amber-600'>Low Stock ({lowPct}%)</p>
            </div>

            <div className='rounded-2xl border border-rose-100 bg-rose-50/40 p-3'>
              <span className='inline-block h-2 w-2 rounded-full bg-rose-500 mb-1' />
              <p className='text-xs font-extrabold text-rose-900'>{outOfStock} Items</p>
              <p className='text-[11px] font-semibold text-rose-600'>Out of Stock ({outPct}%)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Asset & Valuation Summary (1 Col) */}
      <div className='rounded-3xl border border-slate-200/80 bg-linear-to-b from-slate-900 to-indigo-950 p-5 sm:p-6 text-white shadow-sm flex flex-col justify-between space-y-4'>
        <div className='flex items-center justify-between border-b border-slate-800 pb-3.5'>
          <div className='flex items-center gap-2'>
            <PieChart size={18} className='text-indigo-400' />
            <h3 className='font-bold text-sm text-slate-100'>Catalog Summary</h3>
          </div>
          <Sparkles size={16} className='text-amber-400 animate-pulse' />
        </div>

        <div className='space-y-3 py-2'>
          <div>
            <span className='text-[11px] font-bold text-slate-400 uppercase tracking-wider block'>
              Total Estimated Asset Value
            </span>
            <p className='text-3xl font-black text-emerald-400 tracking-tight mt-0.5'>
              {formatCurrencyUsd(totalValue)}
            </p>
          </div>

          <div className='rounded-2xl bg-white/5 border border-white/10 p-3.5 space-y-1.5 text-xs text-slate-300'>
            <div className='flex justify-between font-semibold'>
              <span>Total Active SKUs</span>
              <span className='font-bold text-white'>{totalItems}</span>
            </div>
            <div className='flex justify-between font-semibold'>
              <span>Critical Action Needed</span>
              <span className={`font-bold ${outOfStock > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {outOfStock > 0 ? `${outOfStock} items out` : 'None'}
              </span>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2 text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-800/80'>
          <ShieldAlert size={14} className='text-indigo-400' />
          <span>Real-time database analytics active</span>
        </div>
      </div>
    </div>
  );
}
