import { useMemo, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';
import type { Movement } from '../../../services/movement';
import { useLanguage } from '../../../i18n/language-context';
import {
  buildDailyRevenue,
  type RevenueRange,
} from '../utils/revenue-trend-calculator';
import {
  getRevenueChartData,
  getRevenueChartOptions,
} from '../utils/revenue-trend-chart-config';

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
  const [range, setRange] = useState<RevenueRange>(7);

  const { labels, values, totalInRange, avgPerDay } = useMemo(
    () => buildDailyRevenue(movements, range),
    [movements, range],
  );

  const chartData = useMemo(
    () => getRevenueChartData(labels, values, t('reports.totalSales')),
    [labels, values, t],
  );

  const options = useMemo(() => getRevenueChartOptions(), []);

  if (isLoading) {
    return <div className='h-80 animate-pulse rounded-3xl bg-slate-100' />;
  }

  return (
    <div className='flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs transition hover:shadow-md'>
      {/* Header */}
      <div className='flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100'>
            <TrendingUp size={20} />
          </div>
          <div>
            <h2 className='text-sm sm:text-base font-extrabold text-slate-900'>
              {t('reports.revenueTrend')}
            </h2>
            <div className='flex items-center gap-1.5 text-xs text-slate-500 font-medium'>
              <span>{t('reports.total')}:</span>
              <span className='font-black text-slate-900'>
                {formatCurrencyUsd(totalInRange)}
              </span>
              <span className='text-[11px] text-indigo-600 font-extrabold'>
                ({formatCurrencyKhr(totalInRange)})
              </span>
              <span className='text-slate-300'>•</span>
              <span className='text-slate-400'>
                {t('reports.avgPerDay', { avg: formatCurrencyUsd(avgPerDay) })}
              </span>
            </div>
          </div>
        </div>

        {/* Range Selector */}
        <div className='flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200/60'>
          {RANGES.map((r) => (
            <button
              key={r}
              type='button'
              onClick={() => setRange(r)}
              className={`rounded-lg px-2.5 py-1 text-xs font-extrabold transition-all cursor-pointer ${
                range === r
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {r}D
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className='mt-4 h-56 sm:h-60 w-full'>
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}
