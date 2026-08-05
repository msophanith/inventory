import { Banknote, Calculator } from 'lucide-react';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';

interface Props {
  readonly total: number;
  readonly amountPaid: number;
  readonly onSelectAmount: (amount: number) => void;
}

const USD_DENOMINATIONS = [5, 10, 20, 50, 100];
const KHR_DENOMINATIONS = [
  { label: '20,000៛', usdEquivalent: 5 },
  { label: '40,000៛', usdEquivalent: 10 },
  { label: '80,000៛', usdEquivalent: 20 },
  { label: '200,000៛', usdEquivalent: 50 },
];

export function PosCashPresets({ total, amountPaid, onSelectAmount }: Props) {
  const changeUsd = Math.max(0, amountPaid - total);

  return (
    <div className='space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5'>
      <div className='flex items-center justify-between text-xs font-bold text-slate-700'>
        <div className='flex items-center gap-1.5'>
          <Banknote size={15} className='text-emerald-600' />
          <span>Quick Cash Presets</span>
        </div>
        <button
          type='button'
          onClick={() => onSelectAmount(total)}
          className='rounded-lg bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700 hover:bg-emerald-200 transition cursor-pointer'
        >
          Exact Total ({formatCurrencyUsd(total)})
        </button>
      </div>

      {/* USD Denomination Speed Buttons */}
      <div className='flex flex-wrap items-center gap-1.5'>
        <span className='text-[10px] font-extrabold uppercase text-slate-400 w-8'>
          $ USD
        </span>
        {USD_DENOMINATIONS.map((val) => (
          <button
            key={val}
            type='button'
            onClick={() => onSelectAmount(val)}
            className={`rounded-xl px-2.5 py-1 text-xs font-black transition cursor-pointer border ${
              amountPaid === val
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
            }`}
          >
            ${val}
          </button>
        ))}
      </div>

      {/* KHR Denomination Speed Buttons */}
      <div className='flex flex-wrap items-center gap-1.5'>
        <span className='text-[10px] font-extrabold uppercase text-slate-400 w-8'>
          ៛ KHR
        </span>
        {KHR_DENOMINATIONS.map((item) => (
          <button
            key={item.label}
            type='button'
            onClick={() => onSelectAmount(item.usdEquivalent)}
            className='rounded-xl bg-white border border-slate-200 px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer'
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Change Due Summary Card */}
      {amountPaid > 0 && (
        <div className='flex items-center justify-between border-t border-slate-200 pt-2 text-xs'>
          <span className='font-bold text-slate-600 flex items-center gap-1'>
            <Calculator size={13} className='text-indigo-500' />
            Change Due:
          </span>
          <div className='text-right'>
            <span
              className={`font-black text-sm block leading-tight ${
                amountPaid >= total ? 'text-emerald-600' : 'text-rose-500'
              }`}
            >
              {amountPaid >= total
                ? formatCurrencyUsd(changeUsd)
                : `Insufficient (${formatCurrencyUsd(total - amountPaid)} short)`}
            </span>
            {amountPaid >= total && (
              <span className='text-[10px] font-extrabold text-indigo-600 block'>
                {formatCurrencyKhr(changeUsd)}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
