import { DollarSign } from 'lucide-react';
import FormInput from './form-input';
import { useLanguage } from '@/i18n/language-context';

interface Props {
  readonly register: any;
  readonly errors: any;
}

const ProductPricing = ({ register, errors }: Props) => {
  const { t } = useLanguage();

  return (
    <div className='rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 space-y-5 shadow-2xs'>
      <div className='flex items-center gap-2 border-b border-slate-100 pb-3'>
        <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600'>
          <DollarSign size={18} />
        </div>
        <h2 className='font-bold text-slate-900 text-base'>
          {t('products.pricingDetails')}
        </h2>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <FormInput
          label={t('products.buyPriceCost')}
          name='buyPrice'
          type='number'
          step='any'
          prefix='$'
          register={register}
          error={errors.buyPrice?.message}
          required
        />

        <FormInput
          label={t('products.sellPriceRevenue')}
          name='sellPrice'
          type='number'
          step='any'
          prefix='$'
          register={register}
          error={errors.sellPrice?.message}
          required
        />
      </div>
    </div>
  );
};

export default ProductPricing;
