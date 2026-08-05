import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Movement } from '../../../services/movement';
import { PosOrderHistoryItem } from './pos-order-history-item';

interface Props {
  readonly month: string;
  readonly items: Movement[];
  readonly defaultOpen?: boolean;
  readonly onRePrint: (item: Movement) => void;
}

export function PosOrderHistoryMonthGroup({
  month,
  items,
  defaultOpen = true,
  onRePrint,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className='rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-xs'>
      <button
        type='button'
        onClick={() => setIsOpen((prev) => !prev)}
        className='w-full bg-slate-50/80 hover:bg-slate-100/80 py-2.5 px-3.5 flex items-center justify-between transition cursor-pointer select-none'
      >
        <div className='flex items-center gap-2'>
          {isOpen ? (
            <ChevronDown size={16} className='text-indigo-600' />
          ) : (
            <ChevronRight size={16} className='text-slate-400' />
          )}
          <span className='text-xs font-extrabold text-slate-800 uppercase tracking-wider'>
            {month}
          </span>
        </div>
        <span className='text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100'>
          {items.length} {items.length === 1 ? 'order' : 'orders'}
        </span>
      </button>

      {isOpen && (
        <div className='p-2 space-y-2 bg-white animate-in slide-in-from-top-1 duration-150'>
          {items.map((item) => (
            <PosOrderHistoryItem
              key={item.id}
              item={item}
              onRePrint={onRePrint}
            />
          ))}
        </div>
      )}
    </div>
  );
}
