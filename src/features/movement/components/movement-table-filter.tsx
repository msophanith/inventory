import React from 'react';
import { AlertTriangle, Calendar, CalendarDays, Search, X } from 'lucide-react';
import type { MovementType } from '@/services/movement';
import type { DateRangeFilter } from '@/features/movement/store/use-movement-store';
import type { MonthOption } from '../utils/movement-month';

interface Props {
  readonly selectedType: MovementType | 'ALL';
  readonly onTypeChange: (type: MovementType | 'ALL') => void;
  readonly selectedMonth: string;
  readonly onMonthChange: (month: string) => void;
  readonly monthOptions: MonthOption[];
  readonly dateRange: DateRangeFilter;
  readonly onDateRangeChange: (range: DateRangeFilter) => void;
  readonly damagedOnly: boolean;
  readonly onToggleDamaged: () => void;
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
  readonly exportButton?: React.ReactNode;
}

const TYPE_FILTERS: { label: string; value: MovementType | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Stock In', value: 'IN' },
  { label: 'Stock Out', value: 'OUT' },
  { label: 'Return', value: 'RETURN' },
];

const DATE_RANGE_FILTERS: { label: string; value: DateRangeFilter }[] = [
  { label: 'All Days', value: 'ALL' },
  { label: 'Yesterday', value: 'YESTERDAY' },
  { label: 'Last 7 Days', value: 'LAST_7' },
  { label: 'Last 15 Days', value: 'LAST_15' },
];

export function MovementTableFilter({
  selectedType,
  onTypeChange,
  selectedMonth,
  onMonthChange,
  monthOptions,
  dateRange,
  onDateRangeChange,
  damagedOnly,
  onToggleDamaged,
  searchQuery,
  onSearchChange,
  exportButton,
}: Props) {
  return (
    <div className='flex flex-col gap-3 min-w-0 w-full'>
      {/* Search Bar + Month Dropdown + Type Pills */}
      <div className='flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between min-w-0 w-full'>
        <div className='flex items-center gap-2 flex-1 sm:max-w-xl min-w-0 w-full'>
          <div className='relative flex-1 min-w-0'>
            <Search size={17} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder='Search product, note, ID...'
              className='w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-9 py-2 sm:py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs transition-all'
            />
            {searchQuery && (
              <button
                type='button'
                onClick={() => onSearchChange('')}
                className='absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition'
                aria-label='Clear search'
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Month Selector */}
          <div className='relative flex items-center shrink-0'>
            <Calendar size={14} className='absolute left-3 text-indigo-600 pointer-events-none' />
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className='h-10 rounded-2xl border border-slate-200 bg-white pl-8 pr-7 text-xs font-bold text-slate-800 shadow-2xs hover:border-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer appearance-none'
            >
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className='absolute right-2.5 pointer-events-none text-[9px] text-slate-400'>▼</span>
          </div>
        </div>

        {/* Type pills & Damaged Toggle */}
        <div className='flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap scrollbar-none shrink-0 -mx-1 px-1 sm:mx-0 sm:px-0'>
          {TYPE_FILTERS.map((item) => (
            <button
              key={item.value}
              type='button'
              onClick={() => onTypeChange(item.value)}
              className={`rounded-xl px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold whitespace-nowrap transition cursor-pointer active:scale-95 ${
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
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold whitespace-nowrap transition cursor-pointer active:scale-95 border ${
              damagedOnly
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle size={14} />
            <span>Damaged</span>
          </button>
        </div>
      </div>

      {/* Date Range Chips & Export Button */}
      <div className='flex items-center justify-between gap-2 min-w-0 w-full'>
        <div className='flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap scrollbar-none -mx-1 px-1 sm:mx-0 sm:px-0 flex-1 min-w-0'>
          <div className='flex items-center gap-1 text-slate-400 shrink-0 pr-0.5 text-xs font-semibold'>
            <CalendarDays size={15} />
          </div>
          {DATE_RANGE_FILTERS.map((item) => (
            <button
              key={item.value}
              type='button'
              onClick={() => onDateRangeChange(item.value)}
              className={`rounded-xl px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold whitespace-nowrap transition cursor-pointer active:scale-95 ${
                dateRange === item.value
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-indigo-50/70 text-indigo-700 border border-indigo-200/80 hover:bg-indigo-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {exportButton && <div className='shrink-0'>{exportButton}</div>}
      </div>
    </div>
  );
}
