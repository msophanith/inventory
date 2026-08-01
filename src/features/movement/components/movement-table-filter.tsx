import { AlertTriangle, Search } from 'lucide-react';
import type { MovementType } from '../../../services/movement';

interface Props {
  readonly selectedType: MovementType | 'ALL';
  readonly onTypeChange: (type: MovementType | 'ALL') => void;
  readonly damagedOnly: boolean;
  readonly onToggleDamaged: () => void;
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
}

export function MovementTableFilter({
  selectedType,
  onTypeChange,
  damagedOnly,
  onToggleDamaged,
  searchQuery,
  onSearchChange,
}: Props) {
  const typeFilters: { label: string; value: MovementType | 'ALL' }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Stock In', value: 'IN' },
    { label: 'Stock Out', value: 'OUT' },
    { label: 'Return', value: 'RETURN' },
  ];

  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between min-w-0 w-full'>
      {/* Search Input */}
      <div className='relative flex-1 max-w-md min-w-0 w-full'>
        <Search size={18} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder='Search movement product, note, or ID...'
          className='w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs'
        />
      </div>

      {/* Filter Pills & Damaged Toggle */}
      <div className='flex flex-wrap items-center gap-2 overflow-x-auto pb-1 scrollbar-hide shrink-0'>
        {typeFilters.map((item) => (
          <button
            key={item.value}
            type='button'
            onClick={() => onTypeChange(item.value)}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedType === item.value
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {item.label}
          </button>
        ))}

        <button
          type='button'
          onClick={onToggleDamaged}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer border ${
            damagedOnly
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
          }`}
        >
          <AlertTriangle size={15} />
          <span>Damaged</span>
        </button>
      </div>
    </div>
  );
}
