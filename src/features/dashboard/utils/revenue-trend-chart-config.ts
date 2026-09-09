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
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export function getRevenueChartOptions(): ChartOptions<'line'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleFont: { family: "'Inter', sans-serif", size: 12, weight: 700 },
        bodyFont: { family: "'Inter', sans-serif", size: 12 },
        padding: 10,
        boxPadding: 4,
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.y ?? 0;
            return ` ${formatCurrencyUsd(v)}  (${formatCurrencyKhr(v)})`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 11 },
          color: '#94A3B8',
        },
      },
      y: {
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 11 },
          color: '#94A3B8',
          callback: (v) => `$${v}`,
        },
      },
    },
  };
}

export function getRevenueChartData(
  labels: string[],
  values: number[],
  datasetLabel: string,
) {
  return {
    labels,
    datasets: [
      {
        label: datasetLabel,
        data: values,
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#4F46E5',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        fill: true,
        tension: 0.35,
      },
    ],
  };
}
