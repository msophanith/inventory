import { useMovement } from '../features/movement/hooks/use-movement';
import MovementTable from '../features/movement/components/movement-table';
import { PageContainer } from '../components/layout/page-container';

const ProductMovementPage = () => {
  const { data: movements, isLoading } = useMovement();

  return (
    <PageContainer>
      <MovementTable
        movements={movements ?? []}
        isLoading={isLoading}
      />
    </PageContainer>
  );
};

export { ProductMovementPage };
