import { useState } from 'react';
import ProductTable from '../features/product/components/product-table';
import { useProduct } from '../features/product/hooks/use-product';
import { useDebounce } from '../hooks/use-debounce';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/page-container';

const ProductPage = () => {
  const { useGetProducts, handleSearchChange, search } = useProduct(false);
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const { data, isLoading } = useGetProducts({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: useDebounce(search),
  });

  return (
    <PageContainer>
      <ProductTable
        products={data?.data ?? []}
        loading={isLoading}
        totalRows={data?.count ?? 0}
        pageCount={data?.totalPages ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSearchChange={handleSearchChange}
        onRowClick={(productId) => navigate(`/products/${productId}`)}
        onAddProduct={() => navigate('/products/create')}
      />
    </PageContainer>
  );
};

export { ProductPage };
