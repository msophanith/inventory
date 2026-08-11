import type { UseFormRegister } from 'react-hook-form';
import { DollarSign, Tag, Wallet } from 'lucide-react';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';
import type { FormValues } from './movement-form';

interface Props {
  readonly defaultUnitPrice: number;
  readonly unitPrice: number;
  readonly totalValue: number;
  readonly register: UseFormRegister<FormValues>;
}

export function MovementPriceInput({
  defaultUnitPrice,
  unitPrice,
  totalValue,
  register,
}: Props) {
  return (
    <div className='space-y-3 sm:space-y-4'>
      {/* Unit Price Adjustment Field */}
      <div>
        <div className='flex items-center justify-between mb-1.5'>
          <label className='flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-slate-700 uppercase tracking-wider'>
            <Tag size={14} className='text-indigo-600' />
            Unit Price ($ USD)
          </label>
          <span className='text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200'>
            Default: ${defaultUnitPrice.toFixed(2)}
          </span>
        </div>

        <div className='relative flex items-center'>
          <div className='pointer-events-none absolute left-3.5 flex items-center justify-center text-slate-400 font-bold text-sm'>
            <DollarSign size={16} />
          </div>
          <input
            type='number'
            step='0.01'
            min='0'
            {...register('unitPrice', { valueAsNumber: true })}
            className='w-full rounded-2xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-xs sm:text-sm font-extrabold text-slate-900 shadow-2xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all'
          />
        </div>

        {unitPrice > 0 && (
          <p className='mt-1 text-[11px] font-extrabold text-indigo-600 pl-1'>
            Khmer Riel Equivalent: <span className='underline font-black'>{formatCurrencyKhr(unitPrice)}</span>
          </p>
        )}
      </div>

      {/* Dynamic Total Value Card */}
      <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-4 text-white shadow-xl shadow-slate-900/15 border border-slate-800'>
        {/* Subtle decorative glow circle */}
        <div className='pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-emerald-500/10 blur-xl' />

        <div className='relative flex items-center justify-between gap-3'>
          <div className='flex items-center gap-2.5'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-emerald-400 border border-white/10 backdrop-blur-md shrink-0 shadow-inner'>
              <Wallet size={20} />
            </div>
            <div>
              <p className='text-xs font-extrabold text-slate-300 uppercase tracking-wider'>
                Total Transaction Value
              </p>
              <p className='text-[10px] font-medium text-slate-400'>
                Dual currency calculation
              </p>
            </div>
          </div>

          <div className='text-right'>
            <span className='text-lg sm:text-xl font-black text-emerald-400 block leading-tight tracking-tight'>
              {formatCurrencyUsd(totalValue)}
            </span>
            <span className='inline-block mt-0.5 rounded-md bg-indigo-500/20 px-2 py-0.5 text-[11px] font-black text-indigo-300 border border-indigo-400/30 backdrop-blur-xs'>
              {formatCurrencyKhr(totalValue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
