import ProductInfoSkeleton from '../features/product/components/product-skeleton';
import { useMovement } from '../features/movement/hooks/use-movement';
import { useProduct } from '../features/product/hooks/use-product';
import { PageContainer } from '../components/layout/page-container';

import { DashboardHeader } from '../features/dashboard/components/dashboard-header';
import { DashboardKpiCards } from '../features/dashboard/components/dashboard-kpi-cards';
import { DashboardAnalyticsCharts } from '../features/dashboard/components/dashboard-analytics-charts';
import { DashboardRecentActivity } from '../features/dashboard/components/dashboard-recent-activity';
import { DashboardSalesMarginChart } from '../features/dashboard/components/dashboard-sales-margin-chart';

const DashboardPage = () => {
  const { productSummary, productSummaryLoading } = useProduct(true);
  const { summary, data: movements, isLoading: isMovementLoading } = useMovement();

  return (
    <PageContainer className='space-y-6 sm:space-y-8 pb-24 lg:pb-6'>
      {/* 1. Header Banner with Greeting & Quick Launchers */}
      <DashboardHeader />

      {productSummaryLoading ? (
        <ProductInfoSkeleton />
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

          {/* 3. Interactive Analytics & Distribution */}
          <DashboardAnalyticsCharts
            totalItems={productSummary?.totalItems || 0}
            lowStock={productSummary?.lowStockItems || 0}
            outOfStock={productSummary?.outOfStockItems || 0}
          />

          {/* 4. Live Activity Feed & Sales vs Margin Performance Chart */}
          <div className='space-y-6'>
            <DashboardRecentActivity movements={movements} isLoading={isMovementLoading} />
            <DashboardSalesMarginChart movements={movements} isLoading={isMovementLoading} />
          </div>
        </>
      )}
    </PageContainer>
  );
};

export { DashboardPage };
