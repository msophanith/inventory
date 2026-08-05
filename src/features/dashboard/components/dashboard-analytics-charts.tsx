import { BarChart3 } from 'lucide-react';

interface Props {
  readonly totalItems: number;
  readonly lowStock: number;
  readonly outOfStock: number;
}

export function DashboardAnalyticsCharts({
  totalItems,
  lowStock,
  outOfStock,
}: Props) {
  const healthyCount = Math.max(0, totalItems - (lowStock + outOfStock));

  const healthyPct =
    totalItems > 0 ? Math.round((healthyCount / totalItems) * 100) : 0;
  const lowPct = totalItems > 0 ? Math.round((lowStock / totalItems) * 100) : 0;
  const outPct =
    totalItems > 0 ? Math.round((outOfStock / totalItems) * 100) : 0;

  return (
    <div className='grid grid-cols-1 gap-4'>
      <div className='lg:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-4'>
        <div className='flex items-center justify-between border-b border-slate-100 pb-3.5'>
          <div className='flex items-center gap-2.5'>
            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600'>
              <BarChart3 size={18} />
            </div>
            <div>
              <h2 className='font-extrabold text-slate-900 text-base'>
                Stock Level Distribution
              </h2>
              <p className='text-xs text-slate-500 font-medium'>
                Catalog health ratio across stock levels
              </p>
            </div>
          </div>
          <span className='rounded-xl bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700'>
            {healthyPct}% Healthy
          </span>
        </div>

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
              <p className='text-xs font-extrabold text-slate-900'>
                {healthyCount} Items
              </p>
              <p className='text-[11px] font-semibold text-slate-400'>
                In Stock ({healthyPct}%)
              </p>
            </div>

            <div className='rounded-2xl border border-amber-100 bg-amber-50/40 p-3'>
              <span className='inline-block h-2 w-2 rounded-full bg-amber-400 mb-1' />
              <p className='text-xs font-extrabold text-amber-900'>
                {lowStock} Items
              </p>
              <p className='text-[11px] font-semibold text-amber-600'>
                Low Stock ({lowPct}%)
              </p>
            </div>

            <div className='rounded-2xl border border-rose-100 bg-rose-50/40 p-3'>
              <span className='inline-block h-2 w-2 rounded-full bg-rose-500 mb-1' />
              <p className='text-xs font-extrabold text-rose-900'>
                {outOfStock} Items
              </p>
              <p className='text-[11px] font-semibold text-rose-600'>
                Out of Stock ({outPct}%)
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
