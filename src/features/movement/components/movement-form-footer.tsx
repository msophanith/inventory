import { Loader2 } from 'lucide-react';
import type { MovementType } from '../../../services/movement';
import { formatCurrencyUsd } from '../../../utils/currency';

interface Props {
  readonly type: MovementType;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly quantity: number;
  readonly totalValue?: number;
  readonly onClose: () => void;
}

function getSubmitButtonText(
  type: MovementType,
  quantity: number,
  totalValue?: number,
  loading?: boolean,
): string {
  if (loading) return 'Recording...';
  const totalStr = totalValue !== undefined && totalValue > 0 ? ` · ${formatCurrencyUsd(totalValue)}` : '';
  if (type === 'RETURN') return `Confirm Return (+${quantity})${totalStr}`;
  if (type === 'IN') return `Confirm Stock In (+${quantity})${totalStr}`;
  return `Confirm Stock Out (-${quantity})${totalStr}`;
}

function getSubmitButtonClass(type: MovementType): string {
  if (type === 'IN') {
    return 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20';
  }
  if (type === 'OUT') {
    return 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20';
  }
  return 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20';
}

export default function MovementFormFooter({
  type,
  loading,
  disabled,
  quantity,
  totalValue,
  onClose,
}: Props) {
  return (
    <div className='shrink-0 border-t border-slate-100 bg-white p-3 sm:px-5 sm:py-3.5 flex gap-2.5 shadow-xs'>
      <button
        type='button'
        onClick={onClose}
        disabled={loading}
        className='flex-1 rounded-xl border border-slate-200 bg-white py-3 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer active:scale-95 disabled:opacity-50'
      >
        Cancel
      </button>

      <button
        type='submit'
        disabled={loading || disabled}
        className={`flex-[1.5] flex items-center justify-center gap-2 rounded-xl py-3 text-xs sm:text-sm font-black text-white shadow-md transition-all cursor-pointer active:scale-95 ${getSubmitButtonClass(
          type,
        )} disabled:opacity-40 disabled:pointer-events-none`}
      >
        {loading && <Loader2 size={16} className='animate-spin' />}
        <span>{getSubmitButtonText(type, quantity, totalValue, loading)}</span>
      </button>
    </div>
  );
}
