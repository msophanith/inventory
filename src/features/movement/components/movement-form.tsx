import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import QuantityStepper from './quantity-stepper';
import StockPreview from './stock-preview';
import type { MovementType } from '../../../services/movement';

interface Product {
  quantity: number;
  unit: string;
}

interface Props {
  readonly type: MovementType;
  readonly product: Product;
  readonly loading?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: FormValues) => void;
}

export interface FormValues {
  quantity: number;
  reason: string;
  note: string;
}

const STOCK_IN_REASONS = ['Purchase', 'Return', 'Transfer In', 'Adjustment'];
const STOCK_OUT_REASONS = ['Sale', 'Damage', 'Transfer Out', 'Adjustment'];

export default function MovementForm({
  type,
  product,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const { register, watch, setValue, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      quantity: 1,
      reason: type === 'IN' ? STOCK_IN_REASONS[0] : STOCK_OUT_REASONS[0],
      note: '',
    },
  });

  const quantity = watch('quantity');
  const reason = watch('reason');

  const newStock = useMemo(() => {
    const isDamaged = reason === 'Damage';
    if (type === 'IN') {
      return product.quantity + quantity;
    }

    if (type === 'RETURN') {
      return isDamaged ? product.quantity : product.quantity + quantity;
    }

    return product.quantity - quantity;
  }, [reason, type, product.quantity, quantity]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5 p-6'>
      <StockPreview
        current={product.quantity}
        next={newStock}
        unit={product.unit}
      />

      <QuantityStepper
        value={quantity}
        onChange={(value) => setValue('quantity', value)}
      />

      <div>
        <label className='mb-2 block text-sm font-medium'>Reason</label>

        <select
          {...register('reason')}
          className='w-full rounded-xl border p-3'
        >
          {(type === 'IN' ? STOCK_IN_REASONS : STOCK_OUT_REASONS).map(
            (reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ),
          )}
        </select>
      </div>

      <div>
        <label className='mb-2 block text-sm font-medium'>Note</label>

        <textarea
          rows={3}
          {...register('note')}
          className='w-full rounded-xl border p-3'
          placeholder='Optional note...'
        />
      </div>

      <div className='flex gap-3 pt-2'>
        <button
          type='button'
          onClick={onClose}
          className='flex-1 rounded-xl border py-3 font-medium hover:bg-gray-50 cursor-pointer'
        >
          Cancel
        </button>

        <button
          type='submit'
          disabled={loading || newStock < 0}
          className={`
            flex-1
            rounded-xl
            py-3
            text-white

            ${
              type === 'IN'
                ? 'bg-green-600'
                : type === 'OUT'
                  ? 'bg-red-600'
                  : 'bg-blue-600'
            }

            disabled:opacity-50
          `}
        >
          {loading
            ? 'Saving...'
            : type === 'RETURN'
              ? 'Return'
              : `Stock ${type === 'IN' ? 'In' : 'Out'}`}
        </button>
      </div>
    </form>
  );
}
