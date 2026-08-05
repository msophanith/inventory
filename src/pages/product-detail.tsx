import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import ProductHero from '../features/product-details/components/product-hero';
import ProductStats from '../features/product-details/components/product-stat';
import ProductInfoCard from '../features/product-details/components/product-info-card';
import StockProgress from '../features/product-details/components/stock-progress';
import QuickActions from '../features/product-details/components/quick-action';
import ProductDetailsSkeleton from '../features/product-details/components/skeleton';
import ProductMovementHistory from '../features/product-details/components/product-movement';

import { useProduct } from '../features/product/hooks/use-product';
import { useMovement } from '../features/movement/hooks/use-movement';
import {
  StockMovementModal,
  type FormValues,
} from '../features/movement/components';
import { Toast } from '../components/ui/alert';
import { PageContainer } from '../components/layout/page-container';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { useGetProductById } = useProduct(false);
  const {
    useGetMovementById,
    alert,
    setAlert,
    isCreatingMovement,
    open,
    setOpen,
    type,
    setType,
    updateMovement,
    isUpdatingMovement,
  } = useMovement();

  const { data: product, isLoading } = useGetProductById(productId!);
  const { data: movements, isLoading: movementLoading } = useGetMovementById(
    productId!,
  );

  if (isLoading || !product || movementLoading || !movements) {
    return <ProductDetailsSkeleton />;
  }

  const handleAction = async (actionType: string) => {
    if (actionType === 'in') {
      setType('IN');
      setOpen(true);
    } else if (actionType === 'out') {
      setType('OUT');
      setOpen(true);
    } else if (actionType === 'return') {
      setType('RETURN');
      setOpen(true);
    }
  };

  const onUpdateStock = async (values: FormValues) => {
    const payload = {
      unitPrice: product.sellPrice,
      productId: productId ?? '',
      type,
      isDamaged: values.reason === 'Damage',
      quantity: values.quantity,
      reference: values.reason,
      createdAt: '',
    };

    try {
      await updateMovement(payload);
      setOpen(false);
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <PageContainer className='space-y-6'>
      <div>
        <button
          type='button'
          className='inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs transition cursor-pointer'
          onClick={() => navigate('/products')}
        >
          <ArrowLeft size={16} /> Back to Products
        </button>
      </div>

      <ProductHero product={product} />
      <QuickActions
        isLoading={isCreatingMovement}
        onStockIn={() => handleAction('in')}
        onStockOut={() => handleAction('out')}
        onReturn={() => handleAction('return')}
      />
      <ProductStats product={product} />
      <StockProgress
        quantity={product.quantity}
        minStock={product.minStock}
        unit={product.unit}
      />
      <ProductMovementHistory movements={movements} />
      <ProductInfoCard product={product} />

      <StockMovementModal
        open={open}
        type={type}
        product={product}
        loading={isUpdatingMovement}
        onClose={() => setOpen(false)}
        onSubmit={async (values) => {
          await onUpdateStock(values);
        }}
      />

      {alert && (
        <Toast
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </PageContainer>
  );
};

export { ProductDetailsPage };
