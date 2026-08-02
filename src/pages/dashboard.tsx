import ProductInfoSkeleton from '../features/product/components/product-skeleton';
import { useMovement } from '../features/movement/hooks/use-movement';
import { useProduct } from '../features/product/hooks/use-product';
import { StockAlertSection } from '../features/product/components/stock-alert-section';
import { PageContainer } from '../components/layout/page-container';

import { DashboardHeader } from '../features/dashboard/components/dashboard-header';
import { DashboardKpiCards } from '../features/dashboard/components/dashboard-kpi-cards';
import { DashboardAnalyticsCharts } from '../features/dashboard/components/dashboard-analytics-charts';

const DashboardPage = () => {
  const {
    productSummary,
    productSummaryLoading,
    useGetOutOfStockProducts,
    useGetLowStockProducts,
  } = useProduct(true);

  const { data: outOfStockProducts = [], isLoading: isOutOfStockLoading } =
    useGetOutOfStockProducts(10);

  const { data: lowStockProducts = [], isLoading: isLowStockLoading } =
    useGetLowStockProducts(10);

  const { summary } = useMovement();

  return (
    <PageContainer className='space-y-6 sm:space-y-8 pb-24 lg:pb-6'>
      {/* 1. Header Banner with Time-based Greeting & Quick Launchers */}
      <DashboardHeader />

      {productSummaryLoading ? (
        <ProductInfoSkeleton />
      ) : (
        <>
          {/* 2. Executive KPI Cards with Dual Currency & Alert Counts */}
          <DashboardKpiCards
            totalItems={productSummary?.totalItems || 0}
            lowStock={productSummary?.lowStockItems || 0}
            outOfStock={productSummary?.outOfStockItems || 0}
            totalValue={productSummary?.totalValue || 0}
            todaySale={summary}
          />

          {/* 3. Interactive Analytics & Catalog Health Distribution */}
          <DashboardAnalyticsCharts
            totalItems={productSummary?.totalItems || 0}
            lowStock={productSummary?.lowStockItems || 0}
            outOfStock={productSummary?.outOfStockItems || 0}
            totalValue={productSummary?.totalValue || 0}
          />

          {/* 4. Actionable Low / Out of Stock Alert Tables */}
          <StockAlertSection
            outOfStockProducts={outOfStockProducts}
            lowStockProducts={lowStockProducts}
            isLoading={isOutOfStockLoading || isLowStockLoading}
          />
        </>
      )}
    </PageContainer>
  );
};

export { DashboardPage };
