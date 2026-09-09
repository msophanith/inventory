import type { UseFormRegister } from 'react-hook-form';
import { DollarSign, RotateCcw } from 'lucide-react';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';
import type { MovementType } from '../../../services/movement';
import type { FormValues } from './movement-form';

interface Props {
  readonly defaultUnitPrice: number;
  readonly unitPrice: number;
  readonly totalValue: number;
  readonly quantity: number;
  readonly type: MovementType;
  readonly register: UseFormRegister<FormValues>;
  readonly onResetPrice?: () => void;
}

export function MovementPriceInput({
  defaultUnitPrice,
  unitPrice,
  totalValue,
  quantity,
  type,
  register,
  onResetPrice,
}: Props) {
  const isCustom = Math.abs((unitPrice || 0) - defaultUnitPrice) > 0.001;

  const label =
    type === 'IN' ? 'Unit Cost' : type === 'RETURN' ? 'Unit Refund' : 'Unit Price';

  return (
    <div className='rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-3.5 shadow-2xs'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 items-center'>
        {/* Left: Unit Price Input */}
        <div>
          <div className='flex items-center justify-between mb-1 text-xs'>
            <span className='font-black uppercase tracking-wider text-slate-700'>
              {label}
            </span>
            {isCustom && onResetPrice && (
              <button
                type='button'
                onClick={onResetPrice}
                className='flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800'
              >
                <RotateCcw size={10} /> Reset (${defaultUnitPrice.toFixed(2)})
              </button>
            )}
          </div>

          <div className='relative flex items-center'>
            <div className='pointer-events-none absolute left-2.5 text-slate-400 font-bold'>
              <DollarSign size={15} />
            </div>
            <input
              type='number'
              step='0.01'
              min='0'
              {...register('unitPrice', { valueAsNumber: true })}
              className='w-full rounded-xl border border-slate-200 bg-white py-2 pl-7 pr-3 text-sm font-extrabold text-slate-900 shadow-2xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
            />
          </div>
          <p className='text-[10px] font-medium text-slate-400 mt-1 pl-0.5'>
            Rate: {formatCurrencyKhr(unitPrice || 0)} / unit
          </p>
        </div>

        {/* Right: Calculated Total with Dual Currency */}
        <div className='border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3 flex sm:flex-col justify-between items-center sm:items-end'>
          <div className='text-left sm:text-right'>
            <span className='text-[11px] font-bold text-slate-500 uppercase tracking-wider block'>
              Total ({quantity} pcs)
            </span>
            <span className='text-lg sm:text-xl font-black text-emerald-600 leading-tight block'>
              {formatCurrencyUsd(totalValue)}
            </span>
          </div>

          <span className='inline-block rounded-lg bg-indigo-50 px-2 py-0.5 text-xs font-black text-indigo-700 border border-indigo-200/70'>
            {formatCurrencyKhr(totalValue)}
          </span>
        </div>
      </div>
    </div>
  );
}
