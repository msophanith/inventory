import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { BarChart3 } from 'lucide-react';
import { aggregateSalesAndMargin } from '../../dashboard/utils/sales-margin-calculator';
import type { Movement } from '../../../services/movement';
import { useLanguage } from '../../../i18n/language-context';
import {
  getRevenueCogsChartData,
  getRevenueCogsChartOptions,
} from '../utils/revenue-cogs-chart-config';

interface Props {
  readonly rawMovements: Movement[];
  readonly isLoading?: boolean;
}

export function ReportRevenueCOGSChart({ rawMovements, isLoading }: Props) {
  const { t } = useLanguage();
  const groups = useMemo(
    () => aggregateSalesAndMargin(rawMovements, 'monthly'),
    [rawMovements],
  );

  const options = useMemo(() => getRevenueCogsChartOptions(), []);

  const chartData = useMemo(
    () =>
      getRevenueCogsChartData(groups, {
        revenue: t('reports.revenue'),
        costOfGoods: t('reports.costOfGoods'),
        damageLoss: t('reports.damageLoss'),
      }),
    [groups, t],
  );

  if (isLoading) {
    return <div className='h-72 animate-pulse rounded-3xl bg-slate-100' />;
  }

  if (groups.length === 0) {
    return (
      <div className='rounded-3xl border border-dashed border-slate-200 bg-white/60 p-8 text-center shadow-xs'>
        <p className='text-sm font-bold text-slate-400'>
          {t('reports.noRevenueData')}
        </p>
      </div>
    );
  }

  return (
    <div className='rounded-3xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 shadow-xs backdrop-blur-md space-y-4 transition hover:shadow-md'>
      <div className='flex items-center gap-2.5 border-b border-slate-100 pb-4'>
        <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100'>
          <BarChart3 size={20} />
        </div>
        <div>
          <h2 className='font-extrabold text-slate-900 text-base'>
            {t('reports.revenueVsCogs')}
          </h2>
          <p className='text-xs text-slate-500 font-medium'>
            {t('reports.revenueVsCogsDesc')}
          </p>
        </div>
      </div>
      <div className='h-72'>
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
}
