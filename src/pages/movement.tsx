import { PageMeta } from '../components/seo/page-meta';
import { useMovement } from '../features/movement/hooks/use-movement';
import MovementTable from '../features/movement/components/movement-table';
import { PageContainer } from '../components/layout/page-container';

const ProductMovementPage = () => {
  const { data: movements, isLoading } = useMovement();

  return (
    <PageContainer>
      <PageMeta
        title='Stock Movement'
        description='View and track all stock-in, stock-out, and return movement history.'
      />
      <MovementTable
        movements={movements ?? []}
        isLoading={isLoading}
      />
    </PageContainer>
  );
};

export { ProductMovementPage };
