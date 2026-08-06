import { useState } from 'react';
import { Tag, Ticket, X } from 'lucide-react';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';

interface Props {
  readonly open: boolean;
  readonly subtotal: number;
  readonly onClose: () => void;
  readonly onApplyDiscount: (discount: {
    type: 'PERCENT' | 'FIXED';
    value: number;
    amount: number;
  }) => void;
}

const PROMO_CODES = [
  { code: 'WELCOME10', label: '10% OFF', type: 'PERCENT' as const, val: 10 },
  { code: 'VIP20', label: '20% OFF', type: 'PERCENT' as const, val: 20 },
  { code: 'SUPER5', label: '$5 OFF', type: 'FIXED' as const, val: 5 },
];

export function PosDiscountModal({
  open,
  subtotal,
  onClose,
  onApplyDiscount,
}: Props) {
  const [discType, setDiscType] = useState<'PERCENT' | 'FIXED'>('PERCENT');
  const [inputValue, setInputValue] = useState<string>('');

  if (!open) return null;
  const valNum = Number.parseFloat(inputValue) || 0;
  const calcAmount =
    discType === 'PERCENT'
      ? (subtotal * Math.min(100, Math.max(0, valNum))) / 100
      : Math.min(subtotal, Math.max(0, valNum));

  const handleApply = (type: 'PERCENT' | 'FIXED', val: number) => {
    const amt =
      type === 'PERCENT'
        ? (subtotal * Math.min(100, Math.max(0, val))) / 100
        : Math.min(subtotal, Math.max(0, val));
    onApplyDiscount({ type, value: val, amount: amt });
    onClose();
  };

  return (
    <div className='fixed inset-0 z-110 flex items-end sm:items-center justify-center bg-slate-950/70 p-0 sm:p-4 backdrop-blur-md animate-in fade-in duration-200'>
      <div className='w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200'>
        <div className='flex items-center justify-between border-b border-slate-100 pb-3'>
          <div className='flex items-center gap-2 text-slate-900'>
            <Tag className='h-5 w-5 text-indigo-600' />
            <h3 className='text-lg font-extrabold'>Apply Discount</h3>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='rounded-xl p-1 text-slate-400 hover:bg-slate-100 cursor-pointer'
          >
            <X size={20} />
          </button>
        </div>

        {/* Promo Codes */}
        <div className='space-y-1.5'>
          <p className='text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1'>
            <Ticket size={14} className='text-indigo-500' />
            <span>Featured Promos</span>
          </p>
          <div className='grid grid-cols-3 gap-2'>
            {PROMO_CODES.map((item) => (
              <button
                key={item.code}
                type='button'
                onClick={() => handleApply(item.type, item.val)}
                className='flex flex-col items-center rounded-2xl border border-indigo-100 bg-indigo-50/60 p-2 hover:bg-indigo-100 transition cursor-pointer active:scale-95'
              >
                <span className='text-xs font-black text-indigo-700'>
                  {item.code}
                </span>
                <span className='text-[10px] font-bold text-indigo-500'>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div className='space-y-3 pt-1'>
          <div className='flex rounded-2xl border border-slate-200 bg-slate-50 p-1'>
            <button
              type='button'
              onClick={() => setDiscType('PERCENT')}
              className={`flex-1 rounded-xl py-2 text-xs font-extrabold cursor-pointer ${discType === 'PERCENT' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500'}`}
            >
              Percentage (% Off)
            </button>
            <button
              type='button'
              onClick={() => setDiscType('FIXED')}
              className={`flex-1 rounded-xl py-2 text-xs font-extrabold cursor-pointer ${discType === 'FIXED' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500'}`}
            >
              Fixed Amount ($ Off)
            </button>
          </div>

          {discType === 'PERCENT' && (
            <div className='flex gap-1.5'>
              {[5, 10, 15, 20, 25].map((pct) => (
                <button
                  key={pct}
                  type='button'
                  onClick={() => handleApply('PERCENT', pct)}
                  className='flex-1 rounded-xl border border-slate-200 bg-white py-1.5 text-xs font-extrabold text-slate-700 hover:bg-indigo-50 transition cursor-pointer'
                >
                  {pct}%
                </button>
              ))}
            </div>
          )}

          <div className='relative'>
            <input
              type='number'
              placeholder={
                discType === 'PERCENT' ? 'Enter percentage' : 'Enter USD amount'
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className='w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 pr-10 text-sm font-extrabold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
            />
            <span className='absolute right-3.5 top-3.5 text-xs font-black text-slate-400'>
              {discType === 'PERCENT' ? '%' : '$'}
            </span>
          </div>

          {calcAmount > 0 && (
            <div className='rounded-2xl border border-emerald-200 bg-emerald-50/80 p-2.5 text-center'>
              <p className='text-xs font-bold text-emerald-800'>
                Discount Savings:
              </p>
              <p className='text-base font-black text-emerald-600'>
                -{formatCurrencyUsd(calcAmount)} (
                {formatCurrencyKhr(calcAmount)})
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className='flex gap-2.5 pt-1'>
          <button
            type='button'
            onClick={() => handleApply('PERCENT', 0)}
            className='rounded-2xl border border-slate-200 px-4 py-3 text-xs font-extrabold text-rose-600 hover:bg-rose-50 cursor-pointer'
          >
            Remove
          </button>
          <button
            type='button'
            onClick={() => handleApply(discType, valNum)}
            className='flex-1 rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 py-3 text-xs font-black text-white shadow-md hover:from-indigo-700 transition cursor-pointer active:scale-98'
          >
            Apply Discount
          </button>
        </div>
      </div>
    </div>
  );
}
