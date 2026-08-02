import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Alert from '../../components/ui/alert';
import ProductForm from '../../features/product/components/product-form';
import { useProductAction } from '../../features/product/hooks/use-product-action';
import { useProduct } from '../../features/product/hooks/use-product';
import type { ProductFormValues } from '../../features/product/schema/product.schema';
import { PageContainer } from '../../components/layout/page-container';

const CreateProductPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const barcodeQueryParam = searchParams.get('barcode') || '';

  const { useGetProductById } = useProduct(false);

  const {
    onCreateProduct: onCreateProductAction,
    isCreatingProduct,
    alert,
    setAlert,
    updateProduct,
    isUpdatingProduct,
  } = useProductAction();

  const { data, isLoading } = useGetProductById(productId!);

  const getDefaultValue = (): ProductFormValues => {
    if (data && !isLoading) {
      return {
        name: data.name,
        unit: data.unit,
        quantity: data.quantity,
        minStock: data.minStock,
        buyPrice: data.buyPrice,
        sellPrice: data.sellPrice,
        barcode: data.barcode,
        id: data.id,
        description: data?.description ?? '',
        category: data?.category ?? '',
        shelf: data?.shelf ?? '',
      };
    }

    return {
      id: '',
      unit: 'pcs',
      quantity: 0,
      minStock: 1,
      buyPrice: 0,
      sellPrice: 0,
      barcode: barcodeQueryParam,
      description: '',
      category: '',
      shelf: '',
      name: '',
    };
  };

  const onSubmit = (val: ProductFormValues) => {
    if (productId) {
      updateProduct({
        id: productId,
        data: {
          ...val,
          id: productId,
        },
      });
    } else {
      const newProduct = {
        ...val,
        id: uuidv4(),
      };
      onCreateProductAction(newProduct);
    }
  };

  const isEditing = Boolean(productId);

  return (
    <PageContainer className='space-y-6'>
      {/* Header & Back Button */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <button
            type='button'
            className='inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs transition mb-2 cursor-pointer'
            onClick={() =>
              navigate(productId ? `/products/${productId}` : '/products')
            }
          >
            <ArrowLeft size={16} />
            Back to Products
          </button>

          <h1 className='text-2xl font-extrabold text-slate-900 tracking-tight'>
            {isEditing ? 'Edit Product' : 'Create New Product'}
          </h1>
          <p className='text-xs text-slate-500 font-medium mt-0.5'>
            {isEditing
              ? 'Update existing product information, pricing, and stock limits.'
              : barcodeQueryParam
                ? `Creating new product for scanned barcode "${barcodeQueryParam}"`
                : 'Add a new product to your inventory catalog.'}
          </p>
        </div>
      </div>

      {/* Form Container */}
      <ProductForm
        loading={isCreatingProduct || isUpdatingProduct}
        onSubmit={onSubmit}
        defaultValues={getDefaultValue()}
      />

      {/* Toast Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </PageContainer>
  );
};

export { CreateProductPage };
