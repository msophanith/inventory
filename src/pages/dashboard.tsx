import { PageMeta } from '../components/seo/page-meta';
import { DashboardSkeleton } from '../features/dashboard/components/dashboard-skeleton';
import { useMovement } from '../features/movement/hooks/use-movement';
import { useProduct } from '../features/product/hooks/use-product';
import { PageContainer } from '../components/layout/page-container';

import { DashboardHeader } from '../features/dashboard/components/dashboard-header';
import { DashboardKpiCards } from '../features/dashboard/components/dashboard-kpi-cards';
import { DashboardAnalyticsCharts } from '../features/dashboard/components/dashboard-analytics-charts';
import { DashboardRecentActivity } from '../features/dashboard/components/dashboard-recent-activity';
import { DashboardTopSellers } from '../features/dashboard/components/dashboard-top-sellers';
import { DashboardLowStockFeed } from '../features/dashboard/components/dashboard-low-stock-feed';

export function DashboardPage() {
  const { productSummary, productSummaryLoading } = useProduct(true);
  const {
    summary,
    data: movements,
    isLoading: isMovementLoading,
  } = useMovement();

  return (
    <PageContainer className='space-y-6 sm:space-y-8 pb-24 lg:pb-8'>
      <PageMeta
        title='Dashboard'
        description='Overview of inventory KPIs, sales analytics, top sellers, and stock alerts.'
      />

      {/* 1. Header Banner with Greeting & Quick Launchers */}
      <DashboardHeader />

      {productSummaryLoading || isMovementLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* 2. Executive KPI Cards with Dual Currency */}
          <DashboardKpiCards
            totalItems={productSummary?.totalItems || 0}
            lowStock={productSummary?.lowStockItems || 0}
            outOfStock={productSummary?.outOfStockItems || 0}
            totalValue={productSummary?.totalValue || 0}
            todaySale={summary}
          />

          {/* 3. Stock Distribution + Revenue Trend Line Chart */}
          <DashboardAnalyticsCharts
            totalItems={productSummary?.totalItems || 0}
            lowStock={productSummary?.lowStockItems || 0}
            outOfStock={productSummary?.outOfStockItems || 0}
            movements={movements}
            isLoading={isMovementLoading}
          />
          {/* 4. Live Activity Feed with Filter Pills */}
          <DashboardRecentActivity
            movements={movements}
            isLoading={isMovementLoading}
          />
          {/* 5. Top Sellers + Restock Feed (2-col grid) */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <DashboardTopSellers
              movements={movements}
              isLoading={isMovementLoading}
            />
            <DashboardLowStockFeed />
          </div>
        </>
      )}
    </PageContainer>
  );
}

export default DashboardPage;
