import { Package } from 'lucide-react';
import FormInput from './form-input';
import { useLanguage } from '@/i18n/language-context';

interface Props {
  readonly register: any;
  readonly errors: any;
}

const ProductInventory = ({ register, errors }: Props) => {
  const { t } = useLanguage();

  return (
    <div className='rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 space-y-5 shadow-2xs'>
      <div className='flex items-center gap-2 border-b border-slate-100 pb-3'>
        <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600'>
          <Package size={18} />
        </div>
        <h2 className='font-bold text-slate-900 text-base'>
          {t('products.inventoryStock')}
        </h2>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
        <FormInput
          label={t('products.quantityInStock')}
          name='quantity'
          type='number'
          register={register}
          error={errors.quantity?.message}
          required
        />

        <FormInput
          label={t('products.minStockAlert')}
          name='minStock'
          type='number'
          register={register}
          error={errors.minStock?.message}
          required
        />

        <FormInput
          label={t('products.unitExample')}
          name='unit'
          register={register}
          error={errors.unit?.message}
        />

        <FormInput
          label={t('products.shelfStorageLocation')}
          name='shelf'
          register={register}
        />
      </div>
    </div>
  );
};

export default ProductInventory;
