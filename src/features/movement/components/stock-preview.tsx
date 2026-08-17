import { ArrowRight, AlertTriangle, Layers } from 'lucide-react';

interface Props {
  readonly current: number;
  readonly next: number;
  readonly unit: string;
}

export default function StockPreview({ current, next, unit }: Props) {
  const invalid = next < 0;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 shadow-xs ${
        invalid
          ? 'border-rose-200/90 bg-rose-50/90 text-rose-950'
          : 'border-slate-200/90 bg-white text-slate-900'
      }`}
    >
      <div className='flex items-center justify-between gap-3'>
        {/* Current Stock */}
        <div className='flex-1 rounded-xl bg-slate-100/70 p-2.5 sm:p-3 border border-slate-200/60'>
          <div className='flex items-center gap-1.5 text-slate-500 mb-1'>
            <Layers size={13} className='shrink-0' />
            <p className='text-[11px] font-bold uppercase tracking-wider'>Current</p>
          </div>
          <p className='text-2xl sm:text-3xl font-black text-slate-800 leading-none'>
            {current}
          </p>
          <p className='text-[10px] font-medium text-slate-400 mt-1 truncate'>
            {unit || 'units'}
          </p>
        </div>

        {/* Transition Arrow Badge */}
        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 border border-slate-200/80 shadow-2xs'>
          <ArrowRight size={16} />
        </div>

        {/* New Calculated Stock */}
        <div
          className={`flex-1 rounded-xl p-2.5 sm:p-3 border transition-colors ${
            invalid
              ? 'bg-rose-100/80 border-rose-300/80'
              : 'bg-emerald-50/80 border-emerald-200/80'
          }`}
        >
          <div className='flex items-center justify-between mb-1'>
            <p className={`text-[11px] font-bold uppercase tracking-wider ${invalid ? 'text-rose-700' : 'text-emerald-700'}`}>
              Updated
            </p>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase ${
                invalid
                  ? 'bg-rose-200 text-rose-800'
                  : 'bg-emerald-200 text-emerald-800'
              }`}
            >
              {next > current ? `+${next - current}` : `${next - current}`}
            </span>
          </div>
          <p
            className={`text-2xl sm:text-3xl font-black leading-none ${
              invalid ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {next}
          </p>
          <p className={`text-[10px] font-medium mt-1 truncate ${invalid ? 'text-rose-500' : 'text-emerald-600'}`}>
            {unit || 'units'}
          </p>
        </div>
      </div>

      {invalid && (
        <div className='mt-3 flex items-center gap-2 rounded-xl bg-rose-500 text-white p-2.5 text-xs font-bold shadow-xs animate-in slide-in-from-top-1 duration-200'>
          <AlertTriangle size={16} className='shrink-0 text-amber-300' />
          <span>Quantity exceeds total available stock!</span>
        </div>
      )}
    </div>
  );
}
