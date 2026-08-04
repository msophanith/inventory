import { useMemo, useState } from 'react';
import ProductTable from '../features/product/components/product-table';
import type { StockFilterType } from '../features/product/components/product-table-header';
import { useProduct } from '../features/product/hooks/use-product';
import { exportAllProductsToCsv } from '../features/product/utils/product-csv-export';
import { useDebounce } from '../hooks/use-debounce';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/ui/alert';
import { PageContainer } from '../components/layout/page-container';

const ProductPage = () => {
  const { useGetProducts, handleSearchChange, search } = useProduct(false);
  const navigate = useNavigate();

  const [stockFilter, setStockFilter] = useState<StockFilterType>('ALL');
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const debouncedSearch = useDebounce(search);

  const handleStockFilterChange = (filter: StockFilterType) => {
    setStockFilter(filter);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleSearch = (value: string) => {
    handleSearchChange(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const { data, isLoading } = useGetProducts({
    page: stockFilter === 'ALL' ? pagination.pageIndex + 1 : 1,
    limit: stockFilter === 'ALL' ? pagination.pageSize : 1000,
    search: debouncedSearch,
  });

  const rawProducts = useMemo(() => data?.data ?? [], [data?.data]);

  const filteredProducts = useMemo(() => {
    return rawProducts.filter((p) => {
      const qty = p.quantity || 0;
      const min = p.minStock || 0;
      if (stockFilter === 'OUT_OF_STOCK') return qty <= 0;
      if (stockFilter === 'LOW_STOCK') return qty > 0 && qty <= min;
      if (stockFilter === 'IN_STOCK') return qty > min;
      return true;
    });
  }, [rawProducts, stockFilter]);

  const totalRows =
    stockFilter === 'ALL' ? (data?.count ?? 0) : filteredProducts.length;
  const computedPageCount =
    stockFilter === 'ALL'
      ? (data?.totalPages ?? 1)
      : Math.max(1, Math.ceil(filteredProducts.length / pagination.pageSize));

  const pagedProducts = useMemo(() => {
    if (stockFilter === 'ALL') return filteredProducts;
    const start = pagination.pageIndex * pagination.pageSize;
    return filteredProducts.slice(start, start + pagination.pageSize);
  }, [filteredProducts, stockFilter, pagination]);

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      await exportAllProductsToCsv();
      setToast({
        type: 'success',
        message: 'Product catalog CSV exported successfully!',
      });
    } catch (err) {
      console.error('Export error:', err);
      setToast({
        type: 'error',
        message: 'Failed to export products CSV',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <PageContainer>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <ProductTable
        products={pagedProducts}
        loading={isLoading}
        totalRows={totalRows}
        pageCount={computedPageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        stockFilter={stockFilter}
        onStockFilterChange={handleStockFilterChange}
        onSearchChange={handleSearch}
        onRowClick={(productId) => navigate(`/products/${productId}`)}
        onAddProduct={() => navigate('/products/create')}
        onExportCsv={handleExportCsv}
        isExporting={isExporting}
      />
    </PageContainer>
  );
};

export { ProductPage };
