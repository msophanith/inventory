import { useQuery } from '@tanstack/react-query';
import { productService } from '../../../services';

export function useLowStockNotifications() {
  const { data: lowStockProducts = [], isLoading: isLoadingLow } = useQuery({
    queryKey: ['low-stock-products'],
    queryFn: () => productService.getLowStockProducts(20),
    refetchInterval: 30000, // Refetch every 30s
  });

  const { data: outOfStockProducts = [], isLoading: isLoadingOut } = useQuery({
    queryKey: ['out-of-stock-products'],
    queryFn: () => productService.getOutOfStockProducts(20),
    refetchInterval: 30000,
  });

  const totalAlertCount = lowStockProducts.length + outOfStockProducts.length;

  return {
    lowStockProducts,
    outOfStockProducts,
    totalAlertCount,
    isLoading: isLoadingLow || isLoadingOut,
  };
}
