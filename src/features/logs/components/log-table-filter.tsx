import { Search, Download, RotateCw, X } from 'lucide-react';
import type { ActivityAction, ActivityLog } from '@/services/activity-log.types';
import { useActivityLogStore } from '../store/use-activity-log-store';
import { exportActivityLogsToCSV } from '../utils/log-export-csv';

interface Props {
  allLogs: ActivityLog[];
  isFetching?: boolean;
  onRefresh: () => void;
}

const ACTION_OPTIONS: { label: string; value: ActivityAction | 'ALL' }[] = [
  { label: 'All Operations', value: 'ALL' },
  { label: 'Created', value: 'CREATE' },
  { label: 'Edited', value: 'UPDATE' },
  { label: 'Deleted', value: 'DELETE' },
];

const DATE_OPTIONS: { label: string; value: 'ALL' | 'TODAY' | 'WEEK' | 'MONTH' }[] = [
  { label: 'All Time', value: 'ALL' },
  { label: 'Today', value: 'TODAY' },
  { label: 'Past 7 Days', value: 'WEEK' },
  { label: 'Past 30 Days', value: 'MONTH' },
];

export function LogTableFilter({ allLogs, isFetching, onRefresh }: Props) {
  const search = useActivityLogStore((state) => state.search);
  const setSearch = useActivityLogStore((state) => state.setSearch);
  const actionFilter = useActivityLogStore((state) => state.actionFilter);
  const setActionFilter = useActivityLogStore((state) => state.setActionFilter);
  const dateRange = useActivityLogStore((state) => state.dateRange);
  const setDateRange = useActivityLogStore((state) => state.setDateRange);
  const resetFilters = useActivityLogStore((state) => state.resetFilters);

  const hasActiveFilters = search || actionFilter !== 'ALL' || dateRange !== 'ALL';

  return (
    <div className='bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3'>
      {/* Search and Action Bar */}
      <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3'>
        {/* Search */}
        <div className='relative flex-1'>
          <Search
            size={15}
            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
          />
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search product, barcode, operator...'
            className='w-full pl-9 pr-8 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition'
          />
          {search && (
            <button
              type='button'
              onClick={() => setSearch('')}
              className='absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1'
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-1.5 sm:gap-2 shrink-0'>
          <button
            type='button'
            onClick={() => exportActivityLogsToCSV(allLogs)}
            disabled={allLogs.length === 0}
            className='flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-2xs transition disabled:opacity-50 cursor-pointer'
          >
            <Download size={13} />
            <span className='hidden sm:inline'>Export</span> CSV
          </button>
          <button
            type='button'
            onClick={onRefresh}
            className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-2xs transition cursor-pointer ${
              isFetching ? 'animate-spin' : ''
            }`}
            title='Refresh logs'
          >
            <RotateCw size={14} />
          </button>
          {hasActiveFilters && (
            <button
              type='button'
              onClick={resetFilters}
              className='px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl sm:rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition cursor-pointer'
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Pill Filter Tabs with mobile horizontal scroll */}
      <div className='flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide'>
        {/* Action Filters */}
        <div className='flex items-center gap-1 bg-slate-100 p-1 rounded-xl sm:rounded-2xl shrink-0'>
          {ACTION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type='button'
              onClick={() => setActionFilter(opt.value)}
              className={`px-2.5 sm:px-3 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                actionFilter === opt.value
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Date Filters */}
        <div className='flex items-center gap-1 bg-slate-100 p-1 rounded-xl sm:rounded-2xl shrink-0'>
          {DATE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type='button'
              onClick={() => setDateRange(opt.value)}
              className={`px-2.5 sm:px-3 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                dateRange === opt.value
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
