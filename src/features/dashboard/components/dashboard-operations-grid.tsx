import type { Movement } from '@/services/movement';
import { DashboardRecentActivity } from './dashboard-recent-activity';
import { DashboardLowStockFeed } from './dashboard-low-stock-feed';

interface Props {
  readonly movements?: Movement[];
  readonly isLoading?: boolean;
}

export function DashboardOperationsGrid({ movements = [], isLoading }: Props) {
  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch'>
      <DashboardRecentActivity movements={movements} isLoading={isLoading} />
      <DashboardLowStockFeed />
    </div>
  );
}
