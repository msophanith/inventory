import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';
import type { SalesMarginGroup } from '../utils/sales-margin-calculator';

interface Props {
  readonly group: SalesMarginGroup;
  readonly maxVal: number;
}

export function SalesMarginBarItem({ group, maxVal }: Props) {
  const salesPct = maxVal > 0 ? Math.min(100, Math.max(4, (group.totalSales / maxVal) * 100)) : 0;
  const marginPctOfMax = maxVal > 0 ? Math.min(100, Math.max(0, (group.totalMargin / maxVal) * 100)) : 0;
  const damagePctOfMax = maxVal > 0 ? Math.min(100, Math.max(0, (group.totalDamage / maxVal) * 100)) : 0;

  const isPositiveMargin = group.totalMargin >= 0;

  return (
    <div className='group rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all duration-200 hover:border-indigo-200 hover:bg-white hover:shadow-md active:scale-[0.99]'>
      <div className='flex flex-wrap items-center justify-between gap-2 mb-3'>
        <div className='flex items-center gap-2'>
          <span className='font-extrabold text-slate-800 text-sm sm:text-base'>
            {group.label}
          </span>
          <span className='rounded-full bg-slate-200/70 px-2 py-0.5 text-[11px] font-bold text-slate-600'>
            {group.transactionCount} txns
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <span
            className={`rounded-xl px-2.5 py-1 text-xs font-black transition-colors ${
              isPositiveMargin
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                : 'bg-rose-50 text-rose-700 border border-rose-200/60'
            }`}
          >
            {group.marginPct.toFixed(1)}% Margin
          </span>
        </div>
      </div>

      <div className='space-y-2.5'>
        {/* Total Sales Bar Row */}
        <div className='space-y-1'>
          <div className='flex items-center justify-between text-xs font-semibold'>
            <span className='text-indigo-600 font-extrabold flex items-center gap-1.5'>
              <span className='h-2 w-2 rounded-full bg-indigo-500 inline-block' />
              Total Sales
            </span>
            <div className='text-right'>
              <span className='font-black text-slate-900'>
                {formatCurrencyUsd(group.totalSales)}
              </span>
              <span className='text-[11px] font-semibold text-slate-500 ml-1.5'>
                ({formatCurrencyKhr(group.totalSales)})
              </span>
            </div>
          </div>
          <div className='h-3 w-full overflow-hidden rounded-full bg-slate-200/60 p-0.5 shadow-inner'>
            <div
              style={{ width: `${salesPct}%` }}
              className='h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 transition-all duration-500 shadow-sm'
              title={`Total Sales: ${formatCurrencyUsd(group.totalSales)} (${formatCurrencyKhr(group.totalSales)})`}
            />
          </div>
        </div>

        {/* Total Margin Bar Row */}
        <div className='space-y-1'>
          <div className='flex items-center justify-between text-xs font-semibold'>
            <span className='text-emerald-600 font-extrabold flex items-center gap-1.5'>
              <span className='h-2 w-2 rounded-full bg-emerald-500 inline-block' />
              Total Margin
            </span>
            <div className='text-right'>
              <span className={`font-black ${isPositiveMargin ? 'text-emerald-700' : 'text-rose-600'}`}>
                {formatCurrencyUsd(group.totalMargin)}
              </span>
              <span className='text-[11px] font-semibold text-slate-500 ml-1.5'>
                ({formatCurrencyKhr(group.totalMargin)})
              </span>
            </div>
          </div>
          <div className='h-3 w-full overflow-hidden rounded-full bg-slate-200/60 p-0.5 shadow-inner'>
            <div
              style={{ width: `${marginPctOfMax}%` }}
              className={`h-full rounded-full transition-all duration-500 shadow-sm ${
                isPositiveMargin
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                  : 'bg-gradient-to-r from-rose-400 to-red-500'
              }`}
              title={`Total Margin: ${formatCurrencyUsd(group.totalMargin)} (${formatCurrencyKhr(group.totalMargin)})`}
            />
          </div>
        </div>

        {/* Total Damage Bar Row */}
        {group.totalDamage > 0 && (
          <div className='space-y-1'>
            <div className='flex items-center justify-between text-xs font-semibold'>
              <span className='text-rose-600 font-extrabold flex items-center gap-1.5'>
                <span className='h-2 w-2 rounded-full bg-rose-500 inline-block' />
                Total Damage
              </span>
              <div className='text-right'>
                <span className='font-black text-rose-600'>
                  {formatCurrencyUsd(group.totalDamage)}
                </span>
                <span className='text-[11px] font-semibold text-slate-500 ml-1.5'>
                  ({formatCurrencyKhr(group.totalDamage)})
                </span>
              </div>
            </div>
            <div className='h-3 w-full overflow-hidden rounded-full bg-slate-200/60 p-0.5 shadow-inner'>
              <div
                style={{ width: `${damagePctOfMax}%` }}
                className='h-full rounded-full bg-gradient-to-r from-rose-400 to-red-500 transition-all duration-500 shadow-sm'
                title={`Total Damage: ${formatCurrencyUsd(group.totalDamage)} (${formatCurrencyKhr(group.totalDamage)})`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
