import { Printer } from 'lucide-react';
import type { Movement } from '../../../services/movement';
import { formatDateTime } from '../../../utils/date';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';

interface Props {
  readonly item: Movement;
  readonly onRePrint: (item: Movement) => void;
}

export function PosOrderHistoryItem({ item, onRePrint }: Props) {
  const total = item.quantity * (item.unitPrice || 0);

  return (
    <div className='flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 hover:bg-slate-100/80 transition'>
      <div>
        <div className='flex items-center gap-2'>
          <span className='font-mono font-black text-xs text-slate-900'>
            #{item.id.slice(0, 8).toUpperCase()}
          </span>
          <span className='text-xs font-bold text-slate-700'>
            {item.product?.name} ({item.quantity} qty)
          </span>
        </div>
        <p className='text-[10px] text-slate-400 font-mono mt-0.5'>
          {formatDateTime(item.createdAt, 'dd MMM yyyy, HH:mm')}
        </p>
      </div>

      <div className='flex items-center gap-3 text-right'>
        <div>
          <span className='font-black text-xs text-emerald-600 block'>
            {formatCurrencyUsd(total)}
          </span>
          <span className='font-bold text-[10px] text-indigo-600 block'>
            {formatCurrencyKhr(total)}
          </span>
        </div>
        <button
          type='button'
          onClick={() => onRePrint(item)}
          className='flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-black text-white hover:bg-slate-800 transition cursor-pointer'
        >
          <Printer size={13} /> Re-Print
        </button>
      </div>
    </div>
  );
}
