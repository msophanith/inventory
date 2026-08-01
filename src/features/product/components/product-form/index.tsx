import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { Save } from 'lucide-react';

import ProductBasicInfo from './product-basic-info';
import ProductPricing from './product-pricing';
import ProductInventory from './product-inventory';

import {
  productSchema,
  type ProductFormValues,
} from '../../schema/product.schema';

interface Props {
  readonly defaultValues?: ProductFormValues;
  readonly onSubmit: (data: ProductFormValues) => void;
  readonly loading?: boolean;
}

const ProductForm = ({ defaultValues, onSubmit, loading }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema),
    mode: 'onChange',
    defaultValues: {
      id: '',
      unit: 'pcs',
      quantity: 0,
      minStock: 1,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 min-w-0 w-full'>
      <ProductBasicInfo
        register={register}
        setValue={setValue}
        errors={errors}
      />

      <ProductPricing register={register} errors={errors} />

      <ProductInventory register={register} errors={errors} />

      {/* Save Actions Bar */}
      <div className='flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2'>
        <button
          type='submit'
          disabled={loading}
          className='flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:opacity-50 cursor-pointer active:scale-98'
        >
          <Save size={18} />
          <span>{loading ? 'Saving Product...' : 'Save Product'}</span>
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
