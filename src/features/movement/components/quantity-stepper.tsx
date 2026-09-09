import { Minus, Plus, RotateCcw } from 'lucide-react';

interface Props {
  readonly value: number;
  readonly onChange: (value: number) => void;
  readonly currentStock: number;
  readonly newStock: number;
  readonly unit?: string;
  readonly isDamaged?: boolean;
  readonly maxAvailable?: number;
}

const QUICK_AMOUNTS = [1, 5, 10, 25, 50];

export default function QuantityStepper({
  value,
  onChange,
  currentStock,
  newStock,
  unit = 'pcs',
  isDamaged,
  maxAvailable,
}: Props) {
  const isInvalid = newStock < 0;
  const delta = newStock - currentStock;

  const handleInputChange = (raw: string) => {
    if (raw === '') return onChange(1);
    const parsed = Number.parseInt(raw, 10);
    if (!Number.isNaN(parsed)) onChange(Math.max(1, parsed));
  };

  return (
    <div className='rounded-2xl border border-slate-200 bg-white p-3 sm:p-3.5 shadow-2xs space-y-2.5'>
      {/* Label and Live Stock Change Preview */}
      <div className='flex items-center justify-between text-xs'>
        <span className='font-black uppercase tracking-wider text-slate-700'>
          Quantity ({unit})
        </span>

        <div className='flex items-center gap-1.5'>
          <span className='text-slate-400 font-medium'>Stock:</span>
          <span className='font-bold text-slate-600'>{currentStock}</span>
          <span className='text-slate-300'>➔</span>
          <span
            className={`font-black px-1.5 py-0.5 rounded text-[11px] ${
              isInvalid
                ? 'bg-rose-100 text-rose-700'
                : isDamaged
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {isDamaged ? `${currentStock} ${unit} (Damaged)` : `${newStock} ${unit}`}
          </span>
          {!isDamaged && delta !== 0 && (
            <span className={`text-[10px] font-extrabold ${delta > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ({delta > 0 ? `+${delta}` : delta})
            </span>
          )}
        </div>
      </div>

      {/* Tactile Stepper Row */}
      <div className='flex items-center gap-2'>
        <button
          type='button'
          disabled={value <= 1}
          onClick={() => onChange(Math.max(1, value - 1))}
          className='flex h-11 w-12 sm:h-12 sm:w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer active:scale-95 disabled:opacity-30 disabled:pointer-events-none font-black text-lg shadow-2xs'
          aria-label='Decrease quantity'
        >
          <Minus size={18} />
        </button>

        <div className='relative flex-1'>
          <input
            type='number'
            min={1}
            value={value || ''}
            onChange={(e) => handleInputChange(e.target.value)}
            className={`w-full rounded-xl border py-2.5 text-center text-2xl sm:text-3xl font-black transition-all outline-none ${
              isInvalid
                ? 'border-rose-300 bg-rose-50/50 text-rose-700'
                : 'border-slate-200 bg-slate-50/60 text-slate-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'
            }`}
          />
        </div>

        <button
          type='button'
          onClick={() => onChange(value + 1)}
          className='flex h-11 w-12 sm:h-12 sm:w-14 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all cursor-pointer active:scale-95 font-black text-lg shadow-xs shadow-indigo-600/20'
          aria-label='Increase quantity'
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Quick Add Pills */}
      <div className='flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none'>
        {QUICK_AMOUNTS.map((amt) => (
          <button
            key={amt}
            type='button'
            onClick={() => onChange(value + amt)}
            className='rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all cursor-pointer active:scale-95'
          >
            +{amt}
          </button>
        ))}

        {maxAvailable !== undefined && maxAvailable > 0 && (
          <button
            type='button'
            onClick={() => onChange(maxAvailable)}
            className='rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-black text-rose-700 hover:bg-rose-100 transition-all cursor-pointer active:scale-95'
          >
            All ({maxAvailable})
          </button>
        )}

        {value > 1 && (
          <button
            type='button'
            onClick={() => onChange(1)}
            title='Reset to 1'
            className='flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-400 hover:text-slate-700 transition-all cursor-pointer active:scale-95'
          >
            <RotateCcw size={10} /> Reset
          </button>
        )}
      </div>

      {isInvalid && (
        <p className='text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1 text-center'>
          ⚠️ Quantity exceeds current stock (Available: {currentStock} {unit})
        </p>
      )}
    </div>
  );
}
