import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
  readonly currentCount: number;
  readonly totalCount: number;
  readonly onPageChange: (page: number) => void;
  readonly onPageSizeChange: (size: number) => void;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export function ReportTablePagination({
  page,
  pageSize,
  totalPages,
  currentCount,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: Props) {
  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2'>
      <div className='text-xs sm:text-sm text-slate-500 font-semibold'>
        Showing <span className='text-slate-800 font-bold'>{currentCount}</span> of{' '}
        <span className='text-slate-800 font-bold'>{totalCount}</span> items
      </div>

      <div className='flex items-center gap-3'>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className='rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-700 shadow-xs cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>

        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className='rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-xs hover:bg-slate-50 hover:border-slate-300 active:scale-95 disabled:opacity-40 cursor-pointer transition'
        >
          <ChevronLeft size={18} />
        </button>

        <span className='text-xs sm:text-sm font-bold text-slate-700'>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className='rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-xs hover:bg-slate-50 hover:border-slate-300 active:scale-95 disabled:opacity-40 cursor-pointer transition'
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
