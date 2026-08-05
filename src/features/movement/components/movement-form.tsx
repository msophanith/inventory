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

function getSubmitButtonText(type: MovementType, loading?: boolean): string {
  if (loading) return 'Saving...';
  if (type === 'RETURN') return 'Record Return';
  if (type === 'IN') return 'Confirm Stock In';
  return 'Confirm Stock Out';
}

function getSubmitButtonClass(type: MovementType): string {
  if (type === 'IN') {
    return 'bg-gradient-to-r from-emerald-600 to-green-600 shadow-emerald-500/20 hover:from-emerald-700 hover:to-green-700';
  }
  if (type === 'OUT') {
    return 'bg-gradient-to-r from-rose-600 to-red-600 shadow-rose-500/20 hover:from-rose-700 hover:to-red-700';
  }
  return 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700';
}

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
    if (type === 'IN') return product.quantity + quantity;
    if (type === 'RETURN') return isDamaged ? product.quantity : product.quantity + quantity;
    return product.quantity - quantity;
  }, [reason, type, product.quantity, quantity]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 sm:space-y-5 p-4 pb-8 sm:p-6 sm:pb-6'>
      <StockPreview current={product.quantity} next={newStock} unit={product.unit} />
      <QuantityStepper value={quantity} onChange={(value) => setValue('quantity', value)} />

      <div>
        <label className='mb-1.5 block text-xs sm:text-sm font-bold text-slate-700'>
          Reason / Category
        </label>
        <select
          {...register('reason')}
          className='w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3 text-xs sm:text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer'
        >
          {(type === 'IN' ? STOCK_IN_REASONS : STOCK_OUT_REASONS).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className='mb-1.5 block text-xs sm:text-sm font-bold text-slate-700'>
          Note / Reference (Optional)
        </label>
        <textarea
          rows={2}
          {...register('note')}
          className='w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3 text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400'
          placeholder='Add order reference, invoice #, or reason details...'
        />
      </div>

      <div className='flex gap-3 pt-2 pb-2 sm:pb-0'>
        <button
          type='button'
          onClick={onClose}
          className='flex-1 rounded-2xl border border-slate-200/80 bg-white py-3.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer active:scale-95 shadow-2xs'
        >
          Cancel
        </button>

        <button
          type='submit'
          disabled={loading || newStock < 0}
          className={`flex-1 rounded-2xl py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all transform active:scale-95 cursor-pointer ${getSubmitButtonClass(type)} disabled:opacity-50 disabled:pointer-events-none`}
        >
          {getSubmitButtonText(type, loading)}
        </button>
      </div>
    </form>
  );
}
