import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services';
import type { ProductQueryParams } from '@/services/product';
import { useProductStore } from '@/features/product/store/use-product-store';
import { useAuth } from '@/features/auth/use-auth';

const useProduct = (enableSummary?: boolean) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const useGetProducts = (params?: ProductQueryParams) => {
    return useQuery({
      queryKey: ['products', params],
      queryFn: () => productService.getAll(params),
      staleTime: 60 * 1000,
      placeholderData: (previousData) => previousData,
    });
  };

  const useGetCategories = () => {
    return useQuery({
      queryKey: ['product-categories'],
      queryFn: () => productService.getCategories(),
      staleTime: 5 * 60 * 1000,
    });
  };

  const { data: productSummary, isLoading: productSummaryLoading } = useQuery({
    queryKey: ['productSummary'],
    queryFn: () => productService.getSummary(),
    enabled: enableSummary,
  });

  const useGetProductById = (id: string) => {
    return useQuery({
      queryKey: ['product', id],
      queryFn: () => productService.getById(id),
      enabled: !!id,
    });
  };

  const useGetOutOfStockProducts = (limit = 10) => {
    return useQuery({
      queryKey: ['products-out-of-stock', limit],
      queryFn: () => productService.getOutOfStockProducts(limit),
      enabled: enableSummary,
    });
  };

  const useGetLowStockProducts = (limit = 10) => {
    return useQuery({
      queryKey: ['products-low-stock', limit],
      queryFn: () => productService.getLowStockProducts(limit),
      enabled: enableSummary,
    });
  };

  const useDeleteProduct = () => {
    return useMutation({
      mutationFn: (id: string) => productService.delete(id, user),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['productSummary'] });
        queryClient.invalidateQueries({ queryKey: ['product'] });
        queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
        queryClient.invalidateQueries({ queryKey: ['activity-logs-kpi'] });
      },
    });
  };

  const search = useProductStore((state) => state.search);
  const setSearch = useProductStore((state) => state.setSearch);

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
  };

  return {
    useGetProducts,
    useGetCategories,
    useGetProductById,
    useGetOutOfStockProducts,
    useGetLowStockProducts,
    useDeleteProduct,
    productSummary,
    productSummaryLoading,
    search,
    handleSearchChange,
  };
};

export { useProduct };
