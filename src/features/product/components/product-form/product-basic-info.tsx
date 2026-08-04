import { useCallback, useState } from 'react';
import { Camera, FileText } from 'lucide-react';
import FormInput from './form-input';
import { ProductNameInput } from './product-name-input';
import { useHardwareScanner } from '../../../sell/hooks/use-hardware-scanner';
import { PosCameraScannerModal } from '../../../sell/components/pos-camera-scanner-modal';
import { playScanSound } from '../../../sell/utils/scan-sound';
import type { UseFormSetValue } from 'react-hook-form';
import type { ProductFormValues } from '../../schema/product.schema';

interface Props {
  readonly register: any;
  readonly setValue?: UseFormSetValue<ProductFormValues>;
  readonly watchName?: string;
  readonly errors: any;
}

const ProductBasicInfo = ({ register, setValue, watchName, errors }: Props) => {
  const [isCameraScanOpen, setIsCameraScanOpen] = useState(false);

  const handleBarcodeScanned = useCallback(
    (code: string) => {
      const cleanCode = code.trim();
      if (setValue) {
        setValue('barcode', cleanCode, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      playScanSound();
    },
    [setValue],
  );

  useHardwareScanner({
    enabled: !isCameraScanOpen,
    onScan: handleBarcodeScanned,
  });

  return (
    <div className='rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 space-y-5 shadow-2xs'>
      <div className='flex items-center gap-2 border-b border-slate-100 pb-3'>
        <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600'>
          <FileText size={18} />
        </div>
        <h2 className='font-bold text-slate-900 text-base'>
          Basic Information
        </h2>
      </div>

      <FormInput
        name='id'
        register={register}
        error={errors.id?.message}
        isHidden
      />

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        <FormInput
          label='Barcode'
          name='barcode'
          register={register}
          error={errors.barcode?.message}
          required
          rightElement={
            <button
              type='button'
              onClick={() => setIsCameraScanOpen(true)}
              title='Scan barcode with camera'
              className='flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition cursor-pointer'
            >
              <Camera size={18} />
            </button>
          }
        />

        {/* Product Name with Live Auto-Suggestions */}
        <ProductNameInput
          register={register}
          setValue={setValue}
          watchName={watchName}
          error={errors.name?.message}
        />

        <FormInput
          label='Category'
          name='category'
          register={register}
          error={errors.category?.message}
          required
        />
      </div>

      <div className='space-y-1.5'>
        <label className='block text-xs font-bold uppercase tracking-wider text-slate-600'>
          Description
        </label>
        <textarea
          {...register('description')}
          placeholder='Optional details or specifications...'
          className='min-h-24 w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-semibold text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
        />
      </div>

      <PosCameraScannerModal
        open={isCameraScanOpen}
        onClose={() => setIsCameraScanOpen(false)}
        onDetectedBarcode={handleBarcodeScanned}
      />
    </div>
  );
};

export default ProductBasicInfo;
