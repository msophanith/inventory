import { PageMeta } from '@/components/seo/page-meta';
import { PageContainer } from '@/components/layout/page-container';
import {
  KpiCardsSkeleton,
  AnalyticsGridSkeleton,
  OperationsGridSkeleton,
  SalesSectionSkeleton,
} from '@/features/dashboard/components/dashboard-skeleton';
import { useDashboardData } from '@/features/dashboard/hooks/use-dashboard-data';
import { DashboardHeader } from '@/features/dashboard/components/dashboard-header';
import { DashboardSalesSection } from '@/features/dashboard/components/dashboard-sales-section';
import { DashboardKpiCards } from '@/features/dashboard/components/dashboard-kpi-cards';
import { DashboardAnalyticsGrid } from '@/features/dashboard/components/dashboard-analytics-grid';
import { DashboardOperationsGrid } from '@/features/dashboard/components/dashboard-operations-grid';

export function DashboardPage() {
  const {
    productSummary,
    isSummaryLoading,
    movements,
    isMovementsLoading,
  } = useDashboardData();

  return (
    <PageContainer className='space-y-6 sm:space-y-8 pb-24 lg:pb-8'>
      <PageMeta
        title='Dashboard'
        description='Overview of inventory KPIs, sales analytics, top sellers, and stock alerts.'
      />

      {/* 1. Header Banner with Greeting & Quick Launchers */}
      <DashboardHeader />

      {/* 2. Sales & Revenue Performance */}
      {isMovementsLoading && !movements.length ? (
        <SalesSectionSkeleton />
      ) : (
        <DashboardSalesSection
          movements={movements}
          isLoading={isMovementsLoading}
        />
      )}

      {/* 3. Executive Inventory KPI Cards + Integrated Health Strip */}
      {isSummaryLoading && !productSummary ? (
        <KpiCardsSkeleton />
      ) : (
        <DashboardKpiCards
          totalItems={productSummary?.totalItems || 0}
          lowStock={productSummary?.lowStockItems || 0}
          outOfStock={productSummary?.outOfStockItems || 0}
          totalValue={productSummary?.totalValue || 0}
        />
      )}

      {/* 4. Visual Analytics: Revenue Trend Line + Top Best Sellers */}
      {isMovementsLoading && !movements.length ? (
        <AnalyticsGridSkeleton />
      ) : (
        <DashboardAnalyticsGrid
          movements={movements}
          isLoading={isMovementsLoading}
        />
      )}

      {/* 5. Store Operations: Real-time Movements + Restock Priority Center */}
      {isMovementsLoading && !movements.length ? (
        <OperationsGridSkeleton />
      ) : (
        <DashboardOperationsGrid
          movements={movements}
          isLoading={isMovementsLoading}
        />
      )}
    </PageContainer>
  );
}

export default DashboardPage;
