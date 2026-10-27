import { useQuery, useQueryClient } from '@tanstack/react-query';
import { movementService, productService } from '@/services';
import type { Movement } from '@/services/movement';
import type { ProductSummary } from '@/services/product';

export function useDashboardData() {
  const queryClient = useQueryClient();

  const {
    data: productSummary,
    isLoading: isSummaryLoading,
  } = useQuery<ProductSummary>({
    queryKey: ['productSummary'],
    queryFn: () => productService.getSummary(),
    staleTime: 60 * 1000,
  });

  const {
    data: movements = [],
    isLoading: isMovementsLoading,
  } = useQuery<Movement[]>({
    queryKey: ['dashboard-movements'],
    queryFn: () => movementService.getDashboardMovements(500),
    staleTime: 60 * 1000,
  });

  const refreshDashboard = () => {
    queryClient.invalidateQueries({ queryKey: ['productSummary'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-movements'] });
    queryClient.invalidateQueries({ queryKey: ['month-top-sellers'] });
    queryClient.invalidateQueries({ queryKey: ['products-out-of-stock'] });
    queryClient.invalidateQueries({ queryKey: ['products-low-stock'] });
  };

  return {
    productSummary,
    isSummaryLoading,
    movements,
    isMovementsLoading,
    refreshDashboard,
  };
}
