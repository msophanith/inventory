import { Minus, Plus, Zap } from 'lucide-react';

interface Props {
  readonly value: number;
  readonly onChange: (value: number) => void;
}

const QUICK_VALUES = [1, 5, 10, 20];

export default function QuantityStepper({ value, onChange }: Props) {
  return (
    <div className='space-y-2.5 sm:space-y-3'>
      <div className='flex items-center justify-between'>
        <label className='block text-xs sm:text-sm font-extrabold text-slate-700 uppercase tracking-wider'>
          Movement Quantity
        </label>
        <span className='text-[11px] font-bold text-slate-400'>
          Enter or step amount
        </span>
      </div>

      {/* Stepper controls */}
      <div className='flex items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all'>
        <button
          type='button'
          onClick={() => onChange(Math.max(1, value - 1))}
          className='flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shadow-2xs hover:bg-slate-200 hover:text-slate-900 transition-all cursor-pointer active:scale-90 shrink-0 font-extrabold'
        >
          <Minus size={18} />
        </button>

        <input
          type='number'
          min={1}
          value={value}
          onChange={(e) => onChange(Math.max(1, Number(e.target.value)))}
          className='flex-1 bg-transparent text-center text-2xl sm:text-3xl font-black text-slate-900 outline-none'
        />

        <button
          type='button'
          onClick={() => onChange(value + 1)}
          className='flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all cursor-pointer active:scale-90 shrink-0 font-extrabold'
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Quick Add Pills */}
      <div className='flex items-center gap-1.5 pt-0.5 overflow-x-auto pb-1 scrollbar-none'>
        <span className='flex items-center gap-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0 mr-1'>
          <Zap size={12} className='text-amber-500 fill-amber-500' /> Quick Add:
        </span>
        {QUICK_VALUES.map((item) => (
          <button
            key={item}
            type='button'
            onClick={() => onChange(value + item)}
            className='rounded-xl border border-slate-200/80 bg-white px-3 py-1 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all cursor-pointer active:scale-95 shadow-2xs shrink-0'
          >
            +{item}
          </button>
        ))}
      </div>
    </div>
  );
}
