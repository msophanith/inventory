import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, FileText, FolderInput } from 'lucide-react';
import QuantityStepper from './quantity-stepper';
import StockPreview from './stock-preview';
import { MovementPriceInput } from './movement-price-input';
import type { MovementType } from '../../../services/movement';

interface Product {
  quantity: number;
  unit: string;
  buyPrice?: number;
  sellPrice?: number;
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
  unitPrice: number;
  reason: string;
  note: string;
}

const STOCK_IN_REASONS = ['Purchase', 'Return', 'Transfer In', 'Adjustment'];
const STOCK_OUT_REASONS = ['Sale', 'Damage', 'Transfer Out', 'Adjustment'];

function getSubmitButtonText(type: MovementType, loading?: boolean): string {
  if (loading) return 'Processing...';
  if (type === 'RETURN') return 'Confirm Customer Return';
  if (type === 'IN') return 'Confirm Stock In';
  return 'Confirm Stock Out';
}

function getSubmitButtonClass(type: MovementType): string {
  if (type === 'IN') return 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-500';
  if (type === 'OUT') return 'bg-gradient-to-r from-rose-600 to-red-600 shadow-rose-600/25 hover:from-rose-500 hover:to-red-500';
  return 'bg-gradient-to-r from-indigo-600 to-violet-600 shadow-indigo-600/25 hover:from-indigo-500 hover:to-violet-500';
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

  const { register, watch, setValue, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      quantity: 1,
      unitPrice: defaultUnitPrice,
      reason: type === 'IN' ? STOCK_IN_REASONS[0] : STOCK_OUT_REASONS[0],
      note: '',
    },
  });

  useEffect(() => {
    setValue('unitPrice', defaultUnitPrice);
  }, [defaultUnitPrice, setValue]);

  const quantity = watch('quantity');
  const unitPrice = watch('unitPrice') ?? 0;
  const reason = watch('reason');

  const totalValue = useMemo(() => (quantity || 0) * (unitPrice || 0), [quantity, unitPrice]);

  const newStock = useMemo(() => {
    const isDamaged = reason === 'Damage';
    if (type === 'IN') return product.quantity + quantity;
    if (type === 'RETURN') return isDamaged ? product.quantity : product.quantity + quantity;
    return product.quantity - quantity;
  }, [reason, type, product.quantity, quantity]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col flex-1 min-h-0 overflow-hidden'>
      {/* Scrollable Form Body */}
      <div className='flex-1 overflow-y-auto min-h-0 space-y-4 p-4 sm:p-6 bg-slate-50/40'>
        <StockPreview current={product.quantity} next={newStock} unit={product.unit} />
        <QuantityStepper value={quantity} onChange={(value) => setValue('quantity', value)} />

        <MovementPriceInput
          defaultUnitPrice={defaultUnitPrice}
          unitPrice={unitPrice}
          totalValue={totalValue}
          register={register}
        />

        <div>
          <label className='flex items-center gap-1.5 mb-1.5 text-xs sm:text-sm font-extrabold text-slate-700 uppercase tracking-wider'>
            <FolderInput size={14} className='text-slate-500' />
            Reason / Category
          </label>
          <select
            {...register('reason')}
            className='w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition-all'
          >
            {(type === 'IN' ? STOCK_IN_REASONS : STOCK_OUT_REASONS).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='flex items-center gap-1.5 mb-1.5 text-xs sm:text-sm font-extrabold text-slate-700 uppercase tracking-wider'>
            <FileText size={14} className='text-slate-500' />
            Note / Reference <span className='text-[10px] text-slate-400 font-semibold normal-case'>(Optional)</span>
          </label>
          <textarea
            rows={2}
            {...register('note')}
            className='w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs sm:text-sm font-medium text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400 transition-all'
            placeholder='Add order reference, invoice #, or reason details...'
          />
        </div>
      </div>

      {/* Sticky Modal Footer */}
      <div className='shrink-0 border-t border-slate-200/80 bg-white p-4 sm:px-6 sm:py-4 flex gap-3 shadow-xs'>
        <button
          type='button'
          onClick={onClose}
          className='flex-1 rounded-2xl border border-slate-200 bg-white py-3.5 text-xs sm:text-sm font-extrabold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer active:scale-95 shadow-2xs'
        >
          Cancel
        </button>

        <button
          type='submit'
          disabled={loading || newStock < 0}
          className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-lg transition-all transform active:scale-95 cursor-pointer ${getSubmitButtonClass(type)} disabled:opacity-50 disabled:pointer-events-none`}
        >
          {loading && <Loader2 size={16} className='animate-spin' />}
          <span>{getSubmitButtonText(type, loading)}</span>
        </button>
      </div>
    </form>
  );
}
