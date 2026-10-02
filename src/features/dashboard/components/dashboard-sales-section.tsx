import { useMemo, useState } from 'react';
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
import {
  calculateDashboardSales,
  type DashboardSalesFilter,
} from '../utils/dashboard-sales-calculator';
import { DashboardSalesCard } from './dashboard-sales-card';
import { DashboardSalesFilterTabs } from './dashboard-sales-filter-tabs';
import { useLanguage } from '@/i18n/language-context';

interface Props {
  readonly movements: Movement[];
}

export function DashboardSalesSection({ movements }: Props) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [filter, setFilter] = useState<DashboardSalesFilter>('TODAY');

  const filterOptions: { id: DashboardSalesFilter; label: string }[] = [
    { id: 'TODAY', label: t('reports.today') },
    { id: 'YESTERDAY', label: t('reports.yesterday') },
    { id: 'LAST_7', label: t('reports.last7Days') },
    { id: 'LAST_15', label: t('reports.last15Days') },
    { id: 'THIS_MONTH', label: t('reports.thisMonth') },
    { id: 'ALL', label: t('reports.allTime') },
  ];

  const stats = useMemo(
    () => calculateDashboardSales(movements, filter),
    [movements, filter],
  );

  const activeLabel =
    filterOptions.find((o) => o.id === filter)?.label || t('reports.today');
  const avgTicket =
    stats.totalOrders > 0 ? stats.totalSales / stats.totalOrders : 0;

  return (
    <div className='relative overflow-hidden rounded-3xl border border-slate-200/80 bg-linear-to-br from-white via-indigo-50/20 to-emerald-50/20 p-5 sm:p-6 shadow-xs space-y-5'>
      {/* Top Header + Date Range Selector */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-5 border-b border-slate-200/60'>
        <div className='flex items-center gap-3'>
          <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'>
            <CircleDollarSign size={22} />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <h2 className='text-lg sm:text-xl font-black text-slate-900 tracking-tight'>
                Sales & Revenue
              </h2>
              <span className='rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] px-2 py-0.5 border border-emerald-200'>
                {activeLabel}
              </span>
            </div>
            <p className='text-xs text-slate-500 font-medium'>
              Sales performance, transactions, and net profits for{' '}
              <span className='font-bold text-slate-700'>{activeLabel}</span>
            </p>
          </div>
        </div>

        <DashboardSalesFilterTabs
          currentFilter={filter}
          onSelectFilter={setFilter}
          options={filterOptions}
        />
      </div>

      {/* Sales Stats Grid */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <DashboardSalesCard
          title='Total Sales'
          theme='emerald'
          icon={CircleDollarSign}
          mainValue={formatCurrencyUsd(stats.totalSales)}
          subBadge={
            <span className='inline-flex items-center rounded-lg bg-emerald-100/90 px-2 py-0.5 text-[11px] font-extrabold text-emerald-800 border border-emerald-200/80'>
              {formatCurrencyKhr(stats.totalSales)}
            </span>
          }
          footerText='Net revenue after returns'
        />

        <DashboardSalesCard
          title='Total Orders'
          theme='blue'
          icon={Receipt}
          mainValue={stats.totalOrders}
          subBadge={
            <span className='text-xs font-bold text-slate-500'>
              Avg {formatCurrencyUsd(avgTicket)} / order
            </span>
          }
          footerText='POS sales transactions'
        />

        <DashboardSalesCard
          title='Items Sold'
          theme='indigo'
          icon={PackageCheck}
          mainValue={
            <span>
              {stats.totalItemsSold}{' '}
              <span className='text-sm font-semibold text-slate-500'>Units</span>
            </span>
          }
          footerText='Total stock moved out'
        />

        <DashboardSalesCard
          title='Gross Profit'
          theme='teal'
          icon={TrendingUp}
          mainValue={formatCurrencyUsd(stats.grossProfit)}
          subBadge={
            <div className='flex items-center gap-1.5 flex-wrap'>
              <span className='inline-flex items-center rounded-lg bg-teal-100 px-2 py-0.5 text-[11px] font-extrabold text-teal-800'>
                {stats.marginRate}% Margin
              </span>
              <span className='inline-flex items-center rounded-lg bg-teal-50 px-1.5 py-0.5 text-[10px] font-bold text-teal-700 border border-teal-200/60'>
                {formatCurrencyKhr(stats.grossProfit)}
              </span>
            </div>
          }
          action={
            <button
              type='button'
              onClick={() => navigate('/report')}
              className='flex items-center gap-1 text-xs font-extrabold text-teal-800 hover:text-teal-950 transition cursor-pointer'
            >
              <span>Full Report</span>
              <ArrowUpRight size={13} />
            </button>
          }
        />
      </div>
    </div>
  );
}
