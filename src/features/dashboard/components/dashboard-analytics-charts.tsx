import type { Movement } from '../../../services/movement';
import { DashboardStockDistribution } from './dashboard-stock-distribution';
import { DashboardRevenueTrendChart } from './dashboard-revenue-trend-chart';

interface Props {
  readonly totalItems: number;
  readonly lowStock: number;
  readonly outOfStock: number;
  readonly movements?: Movement[];
  readonly isLoading?: boolean;
}

export function DashboardAnalyticsCharts({
  totalItems,
  lowStock,
  outOfStock,
  movements,
  isLoading,
}: Props) {
  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
      {/* 1. Stock Distribution & Catalog Health */}
      <DashboardStockDistribution
        totalItems={totalItems}
        lowStock={lowStock}
        outOfStock={outOfStock}
      />

      {/* 2. Revenue Trend Line Chart */}
      <DashboardRevenueTrendChart movements={movements} isLoading={isLoading} />
    </div>
  );
}
