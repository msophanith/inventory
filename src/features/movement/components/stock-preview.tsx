import { ArrowRight, AlertTriangle, AlertCircle, Layers } from 'lucide-react';
import type { MovementType } from '../../../services/movement';

interface Props {
  readonly current: number;
  readonly next: number;
  readonly unit: string;
  readonly minStock?: number;
  readonly isDamaged?: boolean;
  readonly type?: MovementType;
}

export default function StockPreview({
  current,
  next,
  unit,
  minStock,
  isDamaged,
  type,
}: Props) {
  const isNegative = next < 0;
  const isDepleted = next === 0 && current > 0;
  const isLowStock =
    minStock !== undefined && minStock > 0 && next > 0 && next <= minStock;
  const diff = next - current;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-3.5 sm:p-4 transition-all duration-200 shadow-2xs ${
        isNegative
          ? 'border-rose-300 bg-rose-50/90 text-rose-950'
          : 'border-slate-200 bg-white text-slate-900'
      }`}
    >
      <div className='flex items-center justify-between gap-2.5 sm:gap-3'>
        {/* Current Stock (Before) */}
        <div className='flex-1 rounded-xl bg-slate-100/80 p-2.5 sm:p-3 border border-slate-200/70'>
          <div className='flex items-center gap-1.5 text-slate-500 mb-0.5'>
            <Layers size={13} className='shrink-0' />
            <p className='text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider'>Current</p>
          </div>
          <p className='text-xl sm:text-2xl font-black text-slate-800 leading-none'>
            {current}
          </p>
          <p className='text-[10px] font-semibold text-slate-400 mt-1 truncate'>
            {unit || 'units'}
          </p>
        </div>

        {/* Transition Badge */}
        <div className='flex flex-col items-center justify-center shrink-0 px-1'>
          <div className='flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 border border-slate-200 shadow-2xs mb-1'>
            <ArrowRight size={14} />
          </div>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
              isNegative
                ? 'bg-rose-200 text-rose-800'
                : isDamaged && type === 'RETURN'
                ? 'bg-amber-100 text-amber-800'
                : diff > 0
                ? 'bg-emerald-100 text-emerald-800'
                : diff < 0
                ? 'bg-rose-100 text-rose-800'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {isDamaged && type === 'RETURN' ? '±0 Damaged' : diff > 0 ? `+${diff}` : `${diff}`}
          </span>
        </div>

        {/* Projected Stock (After) */}
        <div
          className={`flex-1 rounded-xl p-2.5 sm:p-3 border transition-colors ${
            isNegative
              ? 'bg-rose-100/90 border-rose-300'
              : isDepleted
              ? 'bg-amber-50 border-amber-300'
              : 'bg-emerald-50/90 border-emerald-200'
          }`}
        >
          <div className='flex items-center justify-between mb-0.5'>
            <p
              className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider ${
                isNegative ? 'text-rose-700' : isDepleted ? 'text-amber-700' : 'text-emerald-700'
              }`}
            >
              Projected
            </p>
          </div>
          <p
            className={`text-xl sm:text-2xl font-black leading-none ${
              isNegative ? 'text-rose-600' : isDepleted ? 'text-amber-700' : 'text-emerald-600'
            }`}
          >
            {next}
          </p>
          <p
            className={`text-[10px] font-semibold mt-1 truncate ${
              isNegative ? 'text-rose-500' : isDepleted ? 'text-amber-600' : 'text-emerald-600'
            }`}
          >
            {unit || 'units'}
          </p>
        </div>
      </div>

      {/* Dynamic contextual alerts */}
      {isNegative && (
        <div className='mt-2.5 flex items-center gap-2 rounded-xl bg-rose-600 text-white p-2.5 text-xs font-bold shadow-xs animate-in slide-in-from-top-1 duration-150'>
          <AlertTriangle size={15} className='shrink-0 text-amber-300' />
          <span>Cannot issue {Math.abs(diff)} units! Available stock is only {current}.</span>
        </div>
      )}

      {isDepleted && !isNegative && (
        <div className='mt-2.5 flex items-center gap-2 rounded-xl bg-amber-500 text-white p-2 text-xs font-bold shadow-xs'>
          <AlertCircle size={14} className='shrink-0' />
          <span>Warning: Inventory will be completely depleted (0 {unit || 'units'}).</span>
        </div>
      )}

      {isLowStock && !isDepleted && (
        <div className='mt-2.5 flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-[11px] font-bold text-amber-800'>
          <AlertCircle size={13} className='shrink-0 text-amber-600' />
          <span>Will reach low stock threshold (≤ {minStock} {unit || 'units'}).</span>
        </div>
      )}
    </div>
  );
}
