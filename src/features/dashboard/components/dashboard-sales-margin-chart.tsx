import { useMemo, useState } from 'react';
import { TrendingUp, DollarSign, PieChart, Layers, AlertTriangle } from 'lucide-react';
import type { Movement } from '../../../services/movement';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';
import {
  aggregateSalesAndMargin,
  calculateTotals,
  type GroupByPeriod,
} from '../utils/sales-margin-calculator';
import { SalesMarginBarChart } from './sales-margin-bar-chart';

interface Props {
  readonly movements?: Movement[];
  readonly isLoading?: boolean;
}

export function DashboardSalesMarginChart({ movements = [], isLoading }: Props) {
  const [groupBy, setGroupBy] = useState<GroupByPeriod>('monthly');

  const groups = useMemo(() => {
    return aggregateSalesAndMargin(movements, groupBy);
  }, [movements, groupBy]);

  const totals = useMemo(() => {
    return calculateTotals(groups);
  }, [groups]);

  if (isLoading) {
    return (
      <div className='animate-pulse rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4 min-h-[300px]'>
        <div className='h-8 bg-slate-200 rounded-xl w-1/3' />
        <div className='h-20 bg-slate-100 rounded-2xl w-full' />
        <div className='h-64 bg-slate-100 rounded-2xl w-full mt-4' />
      </div>
    );
  }

  return (
    <div className='rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-6'>
      {/* Header & Controls */}
      <div className='flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-200'>
            <TrendingUp size={22} />
          </div>
          <div>
            <h2 className='font-extrabold text-slate-900 text-base sm:text-lg tracking-tight'>
              Sales vs Margin Comparison
            </h2>
            <p className='text-xs font-medium text-slate-500'>
              Vertical Bar Chart comparative analysis of revenue and profit margins
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className='flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1 border border-slate-200/60'>
          {(['monthly', 'daily', 'category'] as GroupByPeriod[]).map((mode) => (
            <button
              key={mode}
              type='button'
              onClick={() => setGroupBy(mode)}
              className={`rounded-xl px-3 py-1.5 text-xs font-extrabold capitalize transition-all duration-200 active:scale-95 ${
                groupBy === mode
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-blue-50/30 p-4'>
          <div className='flex items-center gap-2 text-indigo-700 text-xs font-extrabold mb-1'>
            <DollarSign size={14} /> Total Sales Amount
          </div>
          <p className='text-lg font-black text-slate-900'>
            {formatCurrencyUsd(totals.totalSales)}
          </p>
          <p className='text-xs font-bold text-indigo-600 mt-0.5'>
            {formatCurrencyKhr(totals.totalSales)}
          </p>
        </div>

        <div className='rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 to-teal-50/30 p-4'>
          <div className='flex items-center gap-2 text-emerald-700 text-xs font-extrabold mb-1'>
            <PieChart size={14} /> Total Margin Amount
          </div>
          <p className='text-lg font-black text-slate-900'>
            {formatCurrencyUsd(totals.totalMargin)}
          </p>
          <p className='text-xs font-bold text-emerald-600 mt-0.5'>
            {formatCurrencyKhr(totals.totalMargin)}
          </p>
        </div>

        <div className='rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/70 to-red-50/30 p-4'>
          <div className='flex items-center gap-2 text-rose-700 text-xs font-extrabold mb-1'>
            <AlertTriangle size={14} /> Total Damage Amount
          </div>
          <p className='text-lg font-black text-slate-900'>
            {formatCurrencyUsd(totals.totalDamage)}
          </p>
          <p className='text-xs font-bold text-rose-600 mt-0.5'>
            {formatCurrencyKhr(totals.totalDamage)}
          </p>
        </div>

        <div className='rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/70 to-orange-50/30 p-4'>
          <div className='flex items-center gap-2 text-amber-800 text-xs font-extrabold mb-1'>
            <Layers size={14} /> Overall Profit Ratio
          </div>
          <p className='text-lg font-black text-amber-900'>
            {totals.overallMarginPct.toFixed(1)}%
          </p>
          <p className='text-xs font-bold text-amber-700 mt-0.5'>
            Margin Efficiency
          </p>
        </div>
      </div>

      {/* Chart.js Vertical Bar Chart */}
      {groups.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-slate-200 p-8 text-center'>
          <p className='text-sm font-bold text-slate-500'>
            No sales or margin data found for this view.
          </p>
        </div>
      ) : (
        <SalesMarginBarChart groups={groups} />
      )}
    </div>
  );
}
