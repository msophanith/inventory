import {
  AlertTriangle,
  DollarSign,
  Package,
  Percent,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import type { MonthlyReportSummary } from '../types/report.types';
import { useLanguage } from '../../../i18n/language-context';

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
  const { t } = useLanguage();

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
      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        {/* Card 1: Total Sales */}
        <div className='relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 p-6 text-white shadow-lg shadow-emerald-600/15 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-600/25'>
          <div className='absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10 blur-2xl pointer-events-none' />
          <div className='flex items-center justify-between'>
            <p className='text-xs font-extrabold uppercase tracking-wider text-emerald-100/90'>
              {t('reports.totalSales')} ({monthLabel})
            </p>
            <div className='rounded-2xl bg-white/20 p-2.5 backdrop-blur-md shadow-xs'>
              <DollarSign size={22} className='text-white' />
            </div>
          </div>
          <h2 className='mt-4 text-3xl sm:text-4xl font-black tracking-tight drop-shadow-xs'>
            {formatCurrency(summary.totalSales)}
          </h2>
          <div className='mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-emerald-50 backdrop-blur-xs'>
            <ShoppingBag size={13} />
            <span>
              {summary.totalItemsSold} {t('pos.itemsCount', { count: summary.totalItemsSold })} ({summary.orderCount} {t('reports.totalOrders')})
            </span>
          </div>
        </div>

        {/* Card 2: Total Cost of Goods */}
        <div className='relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-md'>
          <div className='flex items-center justify-between'>
            <p className='text-xs font-extrabold uppercase tracking-wider text-slate-500'>
              {t('products.cost')}
            </p>
            <div className='rounded-2xl bg-indigo-50 p-2.5 text-indigo-600 shadow-xs'>
              <Package size={22} />
            </div>
          </div>
          <h2 className='mt-4 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight'>
            {formatCurrency(summary.totalCost)}
          </h2>
          <p className='mt-4 text-xs font-medium text-slate-500'>
            {t('products.cost')}
          </p>
        </div>

        {/* Card 3: Net Profit Margin */}
        <div className='relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-md'>
          <div className='flex items-center justify-between'>
            <p className='text-xs font-extrabold uppercase tracking-wider text-slate-500'>
              {t('reports.netProfit')}
            </p>
            <div
              className={`rounded-2xl p-2.5 shadow-xs ${
                isMarginPositive
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-rose-50 text-rose-600'
              }`}
            >
              <TrendingUp size={22} />
            </div>
          </div>
          <div className='mt-4 flex items-baseline gap-2'>
            <h2
              className={`text-3xl sm:text-4xl font-black tracking-tight ${
                isMarginPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {formatCurrency(summary.netMargin)}
            </h2>
          </div>
          <div className='mt-4 flex items-center gap-2'>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold shadow-xs ${
                isMarginPositive
                  ? 'bg-emerald-100/90 text-emerald-800'
                  : 'bg-rose-100/90 text-rose-800'
              }`}
            >
              <Percent size={12} />
              {summary.marginPercentage.toFixed(1)}% {t('reports.netProfit')}
            </span>
          </div>
        </div>

        {/* Card 4: Returns & Damage Losses */}
        <div className='relative overflow-hidden rounded-3xl border border-rose-200/70 bg-gradient-to-br from-rose-50/90 via-orange-50/70 to-rose-100/50 p-6 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-rose-300'>
          <div className='flex items-center justify-between'>
            <p className='text-xs font-extrabold uppercase tracking-wider text-rose-800'>
              {t('movement.return')} & {t('movement.damaged')}
            </p>
            <div className='rounded-2xl bg-rose-100 p-2.5 text-rose-600 shadow-xs'>
              <AlertTriangle size={22} />
            </div>
          </div>
          <h2 className='mt-4 text-3xl sm:text-4xl font-black text-rose-700 tracking-tight'>
            {formatCurrency(summary.totalLosses)}
          </h2>
          <div className='mt-4 flex items-center gap-2 text-xs font-bold text-rose-700/90'>
            <span className='rounded-md bg-rose-100 px-2 py-0.5'>{summary.totalItemsReturned} {t('movement.return')}</span>
            <span>•</span>
            <span className='rounded-md bg-amber-100 px-2 py-0.5 text-amber-900'>{summary.totalItemsDamaged} {t('movement.damaged')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
