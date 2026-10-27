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
  type ScriptableContext,
} from 'chart.js';
import { formatCurrencyKhr, formatCurrencyUsd } from '@/utils/currency';

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
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#F8FAFC',
        bodyColor: '#E2E8F0',
        titleFont: { family: "'Inter', sans-serif", size: 12, weight: 700 },
        bodyFont: { family: "'Inter', sans-serif", size: 12, weight: 500 },
        padding: 12,
        cornerRadius: 12,
        boxPadding: 4,
        displayColors: false,
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.y ?? 0;
            return `Sales: ${formatCurrencyUsd(v)}  (${formatCurrencyKhr(v)})`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 11, weight: 500 },
          color: '#94A3B8',
          maxRotation: 0,
        },
      },
      y: {
        border: { display: false },
        grid: {
          color: 'rgba(241, 245, 249, 1)',
        },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 11, weight: 500 },
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
        borderWidth: 2.5,
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return 'rgba(79, 70, 229, 0.08)';
          }
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          gradient.addColorStop(0, 'rgba(79, 70, 229, 0.22)');
          gradient.addColorStop(1, 'rgba(79, 70, 229, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.25,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#4F46E5',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2.5,
      },
    ],
  };
}
