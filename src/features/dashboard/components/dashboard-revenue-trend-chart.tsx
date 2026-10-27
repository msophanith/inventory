import { useMemo, useState } from 'react';
import { TrendingUp, Award, CalendarDays } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { formatCurrencyKhr, formatCurrencyUsd } from '@/utils/currency';
import type { Movement } from '@/services/movement';
import { useLanguage } from '@/i18n/language-context';
import {
  buildDailyRevenue,
  type RevenueRange,
} from '@/features/dashboard/utils/revenue-trend-calculator';
import {
  getRevenueChartData,
  getRevenueChartOptions,
} from '@/features/dashboard/utils/revenue-trend-chart-config';

interface Props {
  readonly movements?: Movement[];
  readonly isLoading?: boolean;
}

const RANGES: RevenueRange[] = [7, 14, 30];

export function DashboardRevenueTrendChart({
  movements = [],
  isLoading,
}: Props) {
  const { t } = useLanguage();
  const [range, setRange] = useState<RevenueRange>(14);

  const { labels, values, totalInRange, avgPerDay, peakDay } = useMemo(
    () => buildDailyRevenue(movements, range),
    [movements, range],
  );

  const chartData = useMemo(
    () => getRevenueChartData(labels, values, t('reports.totalSales')),
    [labels, values, t],
  );

  const options = useMemo(() => getRevenueChartOptions(), []);

  if (isLoading) {
    return <div className='h-96 animate-pulse rounded-3xl bg-slate-100' />;
  }

  return (
    <div className='flex h-full flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs transition hover:shadow-xs'>
      {/* Top Header & Range Switcher */}
      <div className='flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200/60'>
            <TrendingUp size={18} />
          </div>
          <div>
            <h2 className='text-sm sm:text-base font-black text-slate-900 tracking-tight'>
              {t('reports.revenueTrend')}
            </h2>
            <p className='text-xs text-slate-500 font-medium'>
              {t('reports.revenueTrendDesc')}
            </p>
          </div>
        </div>

        {/* Range Selector */}
        <div className='flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200/60'>
          {RANGES.map((r) => (
            <button
              key={r}
              type='button'
              onClick={() => setRange(r)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                range === r
                  ? 'bg-white text-indigo-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {r}D
            </button>
          ))}
        </div>
      </div>

      {/* KPI Highlights Strip (Fills middle space purposefully) */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 border-b border-slate-100/80'>
        {/* Total In Range */}
        <div className='rounded-2xl bg-slate-50/70 border border-slate-200/60 p-3'>
          <div className='text-[11px] font-bold text-slate-400'>
            {t('reports.rangeTotal', { range })}
          </div>
          <div className='mt-1 text-base sm:text-lg font-black text-slate-900 tabular-nums'>
            {formatCurrencyUsd(totalInRange)}
          </div>
          <div className='mt-0.5 text-[11px] font-semibold text-indigo-600'>
            {formatCurrencyKhr(totalInRange)}
          </div>
        </div>

        {/* Daily Average */}
        <div className='rounded-2xl bg-slate-50/70 border border-slate-200/60 p-3'>
          <div className='flex items-center gap-1 text-[11px] font-bold text-slate-400'>
            <CalendarDays size={12} />
            <span>{t('reports.dailyAverage')}</span>
          </div>
          <div className='mt-1 text-base sm:text-lg font-black text-slate-900 tabular-nums'>
            {formatCurrencyUsd(avgPerDay)}
          </div>
          <div className='mt-0.5 text-[11px] font-medium text-slate-500'>
            {t('reports.acrossDays', { days: range })}
          </div>
        </div>

        {/* Peak Day */}
        <div className='rounded-2xl bg-slate-50/70 border border-slate-200/60 p-3'>
          <div className='flex items-center gap-1 text-[11px] font-bold text-emerald-700'>
            <Award size={12} className='text-emerald-500' />
            <span>{t('reports.peakVelocity')}</span>
          </div>
          <div className='mt-1 text-base sm:text-lg font-black text-slate-900 tabular-nums'>
            {peakDay.value > 0 ? formatCurrencyUsd(peakDay.value) : '$0.00'}
          </div>
          <div className='mt-0.5 text-[11px] font-medium text-slate-500'>
            {peakDay.value > 0
              ? t('reports.highestOn', { label: peakDay.label })
              : t('reports.noSalesDataYet')}
          </div>
        </div>
      </div>

      {/* Responsive Chart Canvas */}
      <div className='relative mt-3 w-full flex-1 min-h-55'>
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}
