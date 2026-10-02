import type { DashboardSalesFilter } from '../utils/dashboard-sales-calculator';

interface Props {
  readonly currentFilter: DashboardSalesFilter;
  readonly onSelectFilter: (filter: DashboardSalesFilter) => void;
  readonly options: { id: DashboardSalesFilter; label: string }[];
}

export function DashboardSalesFilterTabs({
  currentFilter,
  onSelectFilter,
  options,
}: Props) {
  return (
    <div className='flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none -mx-1 px-1 sm:mx-0 sm:px-0 shrink-0'>
      {options.map((opt) => (
        <button
          key={opt.id}
          type='button'
          onClick={() => onSelectFilter(opt.id)}
          className={`rounded-xl px-3 py-1.5 text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
            currentFilter === opt.id
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
