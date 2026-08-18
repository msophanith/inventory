import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BarChart3 } from 'lucide-react';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';
import { aggregateSalesAndMargin } from '../../dashboard/utils/sales-margin-calculator';
import type { Movement } from '../../../services/movement';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface Props {
  readonly rawMovements: Movement[];
  readonly isLoading?: boolean;
}

export function ReportRevenueCOGSChart({ rawMovements, isLoading }: Props) {
  const groups = useMemo(
    () => aggregateSalesAndMargin(rawMovements, 'monthly'),
    [rawMovements],
  );

  if (isLoading) {
    return <div className='animate-pulse h-72 rounded-3xl bg-slate-100' />;
  }

  if (groups.length === 0) {
    return (
      <div className='rounded-3xl border border-dashed border-slate-200 bg-white/60 p-8 text-center shadow-xs'>
        <p className='text-sm font-bold text-slate-400'>
          No monthly revenue data found.
        </p>
      </div>
    );
  }

  const labels = groups.map((g) => g.label);
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: groups.map((g) => g.totalSales),
        backgroundColor: 'rgba(16, 185, 129, 0.80)',
        borderColor: 'rgb(5, 150, 105)',
        borderWidth: 1.5,
        borderRadius: 6,
        stack: 'combined',
      },
      {
        label: 'Cost of Goods',
        data: groups.map((g) => g.totalCost),
        backgroundColor: 'rgba(99, 102, 241, 0.75)',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 1.5,
        borderRadius: 6,
        stack: 'combined',
      },
      {
        label: 'Damage / Loss',
        data: groups.map((g) => g.totalDamage),
        backgroundColor: 'rgba(244, 63, 94, 0.75)',
        borderColor: 'rgb(225, 29, 72)',
        borderWidth: 1.5,
        borderRadius: 6,
        stack: 'combined',
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: "'Inter',sans-serif", size: 12, weight: 600 },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.92)',
        titleFont: { family: "'Inter',sans-serif", size: 13, weight: 700 },
        bodyFont: { family: "'Inter',sans-serif", size: 12 },
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.y ?? 0;
            return ` ${ctx.dataset.label}: ${formatCurrencyUsd(v)} (${formatCurrencyKhr(v)})`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: {
          font: { family: "'Inter',sans-serif", size: 11 },
          color: '#64748b',
        },
      },
      y: {
        stacked: true,
        grid: { color: 'rgba(226,232,240,0.5)' },
        ticks: {
          font: { family: "'Inter',sans-serif", size: 11 },
          color: '#64748b',
          callback: (v) => `$${v}`,
        },
      },
    },
  };

  return (
    <div className='rounded-3xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 shadow-xs backdrop-blur-md space-y-4'>
      <div className='flex items-center gap-2.5 border-b border-slate-100 pb-4'>
        <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600'>
          <BarChart3 size={18} />
        </div>
        <div>
          <h2 className='font-extrabold text-slate-900 text-base'>
            Revenue vs Cost of Goods
          </h2>
          <p className='text-xs text-slate-500 font-medium'>
            Monthly stacked breakdown — Revenue · COGS · Damage
          </p>
        </div>
      </div>
      <div className='h-72'>
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
}
