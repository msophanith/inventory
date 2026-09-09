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
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';
import type { SalesMarginGroup } from '../../dashboard/utils/sales-margin-calculator';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function getRevenueCogsChartOptions(): ChartOptions<'bar'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: "'Inter', sans-serif", size: 12, weight: 600 },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleFont: { family: "'Inter', sans-serif", size: 13, weight: 700 },
        bodyFont: { family: "'Inter', sans-serif", size: 12 },
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
          font: { family: "'Inter', sans-serif", size: 11 },
          color: '#64748B',
        },
      },
      y: {
        stacked: true,
        grid: { color: 'rgba(226, 232, 240, 0.5)' },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 11 },
          color: '#64748B',
          callback: (v) => `$${v}`,
        },
      },
    },
  };
}

export function getRevenueCogsChartData(
  groups: SalesMarginGroup[],
  labelsMap: { revenue: string; costOfGoods: string; damageLoss: string },
) {
  return {
    labels: groups.map((g) => g.label),
    datasets: [
      {
        label: labelsMap.revenue,
        data: groups.map((g) => g.totalSales),
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderColor: 'rgb(5, 150, 105)',
        borderWidth: 1.5,
        borderRadius: 6,
        stack: 'combined',
      },
      {
        label: labelsMap.costOfGoods,
        data: groups.map((g) => g.totalCost),
        backgroundColor: 'rgba(99, 102, 241, 0.80)',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 1.5,
        borderRadius: 6,
        stack: 'combined',
      },
      {
        label: labelsMap.damageLoss,
        data: groups.map((g) => g.totalDamage),
        backgroundColor: 'rgba(244, 63, 94, 0.80)',
        borderColor: 'rgb(225, 29, 72)',
        borderWidth: 1.5,
        borderRadius: 6,
        stack: 'combined',
      },
    ],
  };
}
