import { useMemo, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';
import type { Movement } from '../../../services/movement';
import { formatDate } from '../../../utils/date';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Props {
  readonly movements?: Movement[];
  readonly isLoading?: boolean;
}

type Range = 7 | 30;

function buildDailyRevenue(movements: Movement[], days: Range) {
  const now = new Date();
  const labels: string[] = [];
  const values: number[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = formatDate(d, 'yyyy-MM-dd', '');
    const label = formatDate(d, days === 7 ? 'EEE' : 'MMM dd', '');
    labels.push(label);

    const dayTotal = movements
      .filter((m) => m.type === 'OUT' && !m.isDamaged && formatDate(m.createdAt, 'yyyy-MM-dd', '') === key)
      .reduce((sum, m) => sum + Math.abs(m.quantity || 0) * (m.unitPrice ?? m.product?.sellPrice ?? 0), 0);

    values.push(dayTotal);
  }
  return { labels, values };
}

export function DashboardRevenueTrendChart({ movements = [], isLoading }: Props) {
  const [range, setRange] = useState<Range>(7);

  const { labels, values } = useMemo(() => buildDailyRevenue(movements, range), [movements, range]);

  const totalInRange = values.reduce((a, b) => a + b, 0);
  const avgPerDay = values.length > 0 ? totalInRange / values.length : 0;

  if (isLoading) {
    return <div className='animate-pulse h-72 rounded-3xl bg-slate-100' />;
  }

  const chartData = {
    labels,
    datasets: [{
      label: 'Revenue',
      data: values,
      borderColor: 'rgb(79, 70, 229)',
      backgroundColor: 'rgba(99, 102, 241, 0.08)',
      borderWidth: 2.5,
      pointRadius: 4,
      pointBackgroundColor: 'rgb(79, 70, 229)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      fill: true,
      tension: 0.4,
    }],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.92)',
        titleFont: { family: "'Inter', sans-serif", size: 12, weight: 700 },
        bodyFont: { family: "'Inter', sans-serif", size: 12 },
        padding: 12,
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.y ?? 0;
            return ` ${formatCurrencyUsd(v)}  (${formatCurrencyKhr(v)})`;
          },
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: "'Inter',sans-serif", size: 11 }, color: '#94a3b8' } },
      y: {
        grid: { color: 'rgba(226,232,240,0.5)' },
        ticks: { font: { family: "'Inter',sans-serif", size: 11 }, color: '#94a3b8', callback: (v) => `$${v}` },
      },
    },
  };

  return (
    <div className='rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4'>
        <div className='flex items-center gap-2.5'>
          <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600'>
            <TrendingUp size={18} />
          </div>
          <div>
            <h2 className='font-extrabold text-slate-900 text-sm'>Revenue Trend</h2>
            <p className='text-[11px] text-slate-500'>
              Total <span className='font-black text-slate-800'>{formatCurrencyUsd(totalInRange)}</span>
              {' '}· Avg <span className='font-bold text-indigo-600'>{formatCurrencyUsd(avgPerDay)}/day</span>
            </p>
          </div>
        </div>
        <div className='flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200/60'>
          {([7, 30] as Range[]).map((r) => (
            <button key={r} type='button' onClick={() => setRange(r)}
              className={`rounded-lg px-3 py-1 text-xs font-extrabold transition-all ${range === r ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              {r}D
            </button>
          ))}
        </div>
      </div>
      <div className='h-52'>
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}
