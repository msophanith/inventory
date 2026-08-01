import { Minus, Plus } from 'lucide-react';

interface Props {
  readonly value: number;
  readonly onChange: (value: number) => void;
}

const QUICK_VALUES = [1, 5, 10, 20];

export default function QuantityStepper({ value, onChange }: Props) {
  return (
    <div className='space-y-3 sm:space-y-4'>
      <label className='block text-xs sm:text-sm font-bold text-slate-700'>
        Quantity
      </label>

      {/* Stepper controls */}
      <div className='flex items-center rounded-2xl border border-slate-200 bg-slate-50/60 p-1 shadow-2xs'>
        <button
          type='button'
          onClick={() => onChange(Math.max(1, value - 1))}
          className='flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white text-slate-700 shadow-2xs hover:bg-slate-100 transition cursor-pointer active:scale-95 shrink-0'
        >
          <Minus size={18} />
        </button>

        <input
          type='number'
          min={1}
          value={value}
          onChange={(e) => onChange(Math.max(1, Number(e.target.value)))}
          className='flex-1 bg-transparent text-center text-2xl sm:text-3xl font-extrabold text-slate-900 outline-none'
        />

        <button
          type='button'
          onClick={() => onChange(value + 1)}
          className='flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white text-slate-700 shadow-2xs hover:bg-slate-100 transition cursor-pointer active:scale-95 shrink-0'
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Quick Add Pills */}
      <div className='flex flex-wrap gap-2 pt-1'>
        {QUICK_VALUES.map((item) => (
          <button
            key={item}
            type='button'
            onClick={() => onChange(value + item)}
            className='rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition cursor-pointer active:scale-95 shadow-2xs'
          >
            +{item}
          </button>
        ))}
      </div>
    </div>
  );
}
