import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import QuantityStepper from './quantity-stepper';
import { MovementPriceInput } from './movement-price-input';
import MovementReasonSelector from './movement-reason-selector';
import MovementFormFooter from './movement-form-footer';
import type { MovementType } from '../../../services/movement';

type Product = {
  quantity: number;
  unit: string;
  minStock?: number;
  buyPrice?: number;
  sellPrice?: number;
};

interface Props {
  readonly type: MovementType;
  readonly product: Product;
  readonly loading?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: FormValues) => void;
}

export interface FormValues {
  quantity: number;
  unitPrice: number;
  reason: string;
  note: string;
}

export default function MovementForm({
  type,
  product,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const defaultUnitPrice = useMemo(() => {
    if (type === 'IN') return product.buyPrice ?? product.sellPrice ?? 0;
    return product.sellPrice ?? product.buyPrice ?? 0;
  }, [type, product.buyPrice, product.sellPrice]);

  const defaultReason =
    type === 'IN' ? 'Purchase' : type === 'OUT' ? 'Sale' : 'Customer Return';

  const { register, watch, setValue, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      quantity: 1,
      unitPrice: defaultUnitPrice,
      reason: defaultReason,
      note: '',
    },
  });

  useEffect(() => {
    setValue('unitPrice', defaultUnitPrice);
  }, [defaultUnitPrice, setValue]);

  const quantity = watch('quantity') || 1;
  const unitPrice = watch('unitPrice') ?? 0;
  const reason = watch('reason') || defaultReason;

  const totalValue = useMemo(() => quantity * (unitPrice || 0), [quantity, unitPrice]);

  const isDamaged = reason === 'Damage';
  const newStock = useMemo(() => {
    if (type === 'IN') return product.quantity + quantity;
    if (type === 'RETURN') return isDamaged ? product.quantity : product.quantity + quantity;
    return product.quantity - quantity;
  }, [isDamaged, type, product.quantity, quantity]);

  const isInvalid = newStock < 0 || quantity <= 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col flex-1 min-h-0 overflow-hidden'>
      {/* Form Body - Compact & Zero Scroll */}
      <div className='flex-1 overflow-y-auto min-h-0 space-y-3 p-3.5 sm:p-4 bg-slate-50/40'>
        {/* 1. Stepper with Inline Stock Preview */}
        <QuantityStepper
          value={quantity}
          onChange={(val) => setValue('quantity', val)}
          currentStock={product.quantity}
          newStock={newStock}
          unit={product.unit}
          isDamaged={isDamaged}
          maxAvailable={type === 'OUT' ? product.quantity : undefined}
        />

        {/* 2. Reason Quick Chips */}
        <MovementReasonSelector
          type={type}
          selectedReason={reason}
          onSelectReason={(val) => setValue('reason', val)}
        />

        {/* 3. Combined Financial Card (Price & Total) */}
        <MovementPriceInput
          defaultUnitPrice={defaultUnitPrice}
          unitPrice={unitPrice}
          totalValue={totalValue}
          quantity={quantity}
          type={type}
          register={register}
          onResetPrice={() => setValue('unitPrice', defaultUnitPrice)}
        />

        {/* 4. Compact 1-Line Note Input */}
        <input
          type='text'
          {...register('note')}
          className='w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
          placeholder='Note or reference # (optional)...'
        />
      </div>

      {/* 5. Sticky Footer Action Bar */}
      <MovementFormFooter
        type={type}
        loading={loading}
        disabled={isInvalid}
        quantity={quantity}
        totalValue={totalValue}
        onClose={onClose}
      />
    </form>
  );
}
