import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  CircleDollarSign,
  PackageCheck,
  Receipt,
  TrendingUp,
} from 'lucide-react';
import type { Movement } from '@/services/movement';
import { formatCurrencyKhr, formatCurrencyUsd } from '@/utils/currency';
import { calculateDashboardSales } from '../utils/dashboard-sales-calculator';
import { DashboardSalesCard } from './dashboard-sales-card';
import { useLanguage } from '@/i18n/language-context';

interface Props {
  readonly movements: Movement[];
  readonly isLoading?: boolean;
}

export function DashboardSalesSection({ movements, isLoading }: Props) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const stats = useMemo(
    () => calculateDashboardSales(movements, 'TODAY'),
    [movements],
  );

  const avgTicket =
    stats.totalOrders > 0 ? stats.totalSales / stats.totalOrders : 0;

  return (
    <div className='relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-5'>
      {/* Header */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/60'>
            <CircleDollarSign size={20} />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <h2 className='text-base sm:text-lg font-black text-slate-900 tracking-tight'>
                {t('reports.todaySalesRevenue')}
              </h2>
              <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/60'>
                <span className='h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse' />
                {t('reports.today')}
              </span>
            </div>
            <p className='text-xs text-slate-500 font-medium'>
              {t('reports.todaySalesSubtitle')}
            </p>
          </div>
        </div>

        <button
          type='button'
          onClick={() => navigate('/report')}
          className='flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition active:scale-95 cursor-pointer'
        >
          <span>{t('reports.viewReport')}</span>
          <ArrowUpRight size={13} className='text-slate-400' />
        </button>
      </div>

      {/* 4 Performance Metric Cards */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {/* 1. Hero Net Sales Card */}
        <DashboardSalesCard
          title={t('reports.todayNetSales')}
          theme='emerald'
          icon={CircleDollarSign}
          isHero={true}
          mainValue={isLoading ? '...' : formatCurrencyUsd(stats.totalSales)}
          subBadge={
            <span className='inline-flex items-center rounded-lg bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-500/30'>
              {formatCurrencyKhr(stats.totalSales)}
            </span>
          }
          footerText={t('reports.netRevenueAfterReturns')}
        />

        {/* 2. Gross Profit & Margin */}
        <DashboardSalesCard
          title={t('reports.todayGrossProfit')}
          theme='teal'
          icon={TrendingUp}
          mainValue={isLoading ? '...' : formatCurrencyUsd(stats.grossProfit)}
          subBadge={
            <div className='flex items-center gap-1.5 flex-wrap'>
              <span className='inline-flex items-center rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/60'>
                {stats.marginRate}% {t('reports.margin')}
              </span>
              <span className='text-[11px] font-semibold text-slate-500'>
                {formatCurrencyKhr(stats.grossProfit)}
              </span>
            </div>
          }
          footerText={t('reports.netProfitEarnedToday')}
        />

        {/* 3. Transaction Orders */}
        <DashboardSalesCard
          title={t('reports.ordersToday')}
          theme='blue'
          icon={Receipt}
          mainValue={isLoading ? '...' : stats.totalOrders}
          subBadge={
            <span className='text-xs font-semibold text-slate-500'>
              {t('reports.avgPerOrder', { avg: formatCurrencyUsd(avgTicket) })}
            </span>
          }
          footerText={t('reports.completedPosTransactions')}
        />

        {/* 4. Units Moved */}
        <DashboardSalesCard
          title={t('reports.itemsSoldToday')}
          theme='indigo'
          icon={PackageCheck}
          mainValue={
            <span>
              {isLoading ? '...' : stats.totalItemsSold}{' '}
              <span className='text-sm font-semibold text-slate-400'>
                {t('reports.units')}
              </span>
            </span>
          }
          footerText={t('reports.inventoryStockMovedOut')}
        />
      </div>
    </div>
  );
}
