import type { Movement } from '@/services/movement';
import { DashboardRevenueTrendChart } from './dashboard-revenue-trend-chart';
import { DashboardTopSellers } from './dashboard-top-sellers';

interface Props {
  readonly movements?: Movement[];
  readonly isLoading?: boolean;
}

export function DashboardAnalyticsGrid({ movements = [], isLoading }: Props) {
  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch'>
      <DashboardRevenueTrendChart movements={movements} isLoading={isLoading} />
      <DashboardTopSellers />
    </div>
  );
}
