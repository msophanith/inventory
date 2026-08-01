import {
  AlertTriangle,
  DollarSign,
  Package,
  Percent,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import type { MonthlyReportSummary } from '../types/report.types';

interface Props {
  readonly summary: MonthlyReportSummary;
  readonly monthLabel: string;
  readonly loading?: boolean;
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);

export function ReportSummary({ summary, monthLabel, loading }: Props) {
  if (loading) {
    return (
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className='h-32 animate-pulse rounded-3xl bg-slate-200/70'
          />
        ))}
      </div>
    );
  }

  const isMarginPositive = summary.netMargin >= 0;

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {/* Card 1: Total Sales */}
        <div className='relative overflow-hidden rounded-3xl border border-emerald-100 bg-linear-to-br from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white shadow-xl shadow-emerald-600/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'>
          <div className='absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl pointer-events-none' />
          <div className='flex items-center justify-between'>
            <p className='text-xs font-semibold uppercase tracking-wider text-emerald-100'>
              Total Sales ({monthLabel})
            </p>
            <div className='rounded-2xl bg-white/15 p-2.5 backdrop-blur-md'>
              <DollarSign size={22} />
            </div>
          </div>
          <h2 className='mt-3 text-3xl font-extrabold tracking-tight'>
            {formatCurrency(summary.totalSales)}
          </h2>
          <div className='mt-3 flex items-center gap-1.5 text-xs text-emerald-100/90'>
            <ShoppingBag size={14} />
            <span>
              {summary.totalItemsSold} items sold across {summary.orderCount}{' '}
              orders
            </span>
          </div>
        </div>

        {/* Card 2: Total Cost of Goods */}
        <div className='relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md'>
          <div className='flex items-center justify-between'>
            <p className='text-xs font-semibold uppercase tracking-wider text-slate-500'>
              Total Buy Price (Cost)
            </p>
            <div className='rounded-2xl bg-indigo-50 p-2.5 text-indigo-600'>
              <Package size={22} />
            </div>
          </div>
          <h2 className='mt-3 text-3xl font-extrabold text-slate-900 tracking-tight'>
            {formatCurrency(summary.totalCost)}
          </h2>
          <p className='mt-3 text-xs text-slate-500'>
            Original purchase cost of goods sold
          </p>
        </div>

        {/* Card 3: Net Profit Margin */}
        <div className='relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md'>
          <div className='flex items-center justify-between'>
            <p className='text-xs font-semibold uppercase tracking-wider text-slate-500'>
              Net Profit Margin
            </p>
            <div
              className={`rounded-2xl p-2.5 ${
                isMarginPositive
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-rose-50 text-rose-600'
              }`}
            >
              <TrendingUp size={22} />
            </div>
          </div>
          <div className='mt-3 flex items-baseline gap-2'>
            <h2
              className={`text-3xl font-extrabold tracking-tight ${
                isMarginPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {formatCurrency(summary.netMargin)}
            </h2>
          </div>
          <div className='mt-3 flex items-center gap-2'>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                isMarginPositive
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              <Percent size={11} />
              {summary.marginPercentage.toFixed(1)}% Margin
            </span>
          </div>
        </div>

        {/* Card 4: Returns & Damage Losses */}
        <div className='relative overflow-hidden rounded-3xl border border-rose-100 bg-linear-to-br from-rose-50 to-orange-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md'>
          <div className='flex items-center justify-between'>
            <p className='text-xs font-semibold uppercase tracking-wider text-rose-700'>
              Returns & Damage Loss
            </p>
            <div className='rounded-2xl bg-rose-100 p-2.5 text-rose-600'>
              <AlertTriangle size={22} />
            </div>
          </div>
          <h2 className='mt-3 text-3xl font-extrabold text-rose-700 tracking-tight'>
            {formatCurrency(summary.totalLosses)}
          </h2>
          <div className='mt-3 flex items-center justify-between text-xs text-rose-600/90 font-medium'>
            <span>{summary.totalItemsReturned} returned</span>
            <span>•</span>
            <span>{summary.totalItemsDamaged} damaged</span>
          </div>
        </div>
      </div>
    </div>
  );
}
