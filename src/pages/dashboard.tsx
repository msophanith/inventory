import Hero from '../components/dashboard/hero';
import ProductInfoSkeleton from '../features/product/components/product-skeleton';
import ProductInfo from '../features/product/components/product-stat';
import { useMovement } from '../features/movement/hooks/use-movement';
import { useProduct } from '../features/product/hooks/use-product';
import { TodaySaleCard } from '../features/product/components/today-sale-card';
import { StockAlertSection } from '../features/product/components/stock-alert-section';
import { PageContainer } from '../components/layout/page-container';

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

  const { summary, isGettingSummary } = useMovement();

  return (
    <PageContainer className='space-y-5 sm:space-y-8 pb-24 lg:pb-6'>
      {productSummaryLoading ? (
        <ProductInfoSkeleton />
      ) : (
        <>
          <ProductInfo
            totalItems={productSummary?.totalItems || 0}
            lowStock={productSummary?.lowStockItems || 0}
            outOfStock={productSummary?.outOfStockItems || 0}
            totalValue={productSummary?.totalValue || 0}
          />
          <TodaySaleCard data={summary} loading={isGettingSummary} />
          <StockAlertSection
            outOfStockProducts={outOfStockProducts}
            lowStockProducts={lowStockProducts}
            isLoading={isOutOfStockLoading || isLowStockLoading}
          />
        </>
      )}
      <Hero />
    </PageContainer>
  );
};

export { DashboardPage };
