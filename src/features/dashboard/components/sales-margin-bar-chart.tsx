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
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';
import type { SalesMarginGroup } from '../utils/sales-margin-calculator';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface Props {
  readonly groups: SalesMarginGroup[];
}

export function SalesMarginBarChart({ groups }: Props) {
  const labels = groups.map((g) => g.label);
  const salesData = groups.map((g) => g.totalSales);
  const marginData = groups.map((g) => g.totalMargin);
  const damageData = groups.map((g) => g.totalDamage);

  const data = {
    labels,
    datasets: [
      {
        label: 'Total Sales',
        data: salesData,
        backgroundColor: 'rgba(99, 102, 241, 0.85)',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 1.5,
        borderRadius: 8,
      },
      {
        label: 'Total Margin',
        data: marginData,
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderColor: 'rgb(5, 150, 105)',
        borderWidth: 1.5,
        borderRadius: 8,
      },
      {
        label: 'Total Damage',
        data: damageData,
        backgroundColor: 'rgba(244, 63, 94, 0.85)',
        borderColor: 'rgb(225, 29, 72)',
        borderWidth: 1.5,
        borderRadius: 8,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: 600,
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { family: "'Inter', sans-serif", size: 13, weight: 700 },
        bodyFont: { family: "'Inter', sans-serif", size: 12 },
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: (context) => {
            const raw = context.parsed.y ?? 0;
            const labelName = context.dataset.label ?? '';
            return `${labelName}: ${formatCurrencyUsd(raw)} (${formatCurrencyKhr(raw)})`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 11, weight: 600 },
          color: '#64748b',
        },
      },
      y: {
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 11, weight: 600 },
          color: '#64748b',
          callback: (value) => `$${value}`,
        },
      },
    },
  };

  return (
    <div className='w-full h-[320px] sm:h-[360px] p-2'>
      <Bar options={options} data={data} />
    </div>
  );
}
