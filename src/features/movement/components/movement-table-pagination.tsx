import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  readonly page: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly pageSize: number;
  readonly pageSizeOptions: number[];
  readonly onPageChange: (newPage: number) => void;
  readonly onPageSizeChange: (newSize: number) => void;
}

export function MovementTablePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const startCount = totalItems > 0 ? (page - 1) * pageSize + 1 : 0;
  const endCount = Math.min(page * pageSize, totalItems);

  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 font-semibold'>
      <p>
        Showing <span className='font-extrabold text-slate-900'>{startCount}-{endCount}</span> of <span className='font-extrabold text-slate-900'>{totalItems}</span> transactions
      </p>

      <div className='flex items-center gap-3 self-end sm:self-auto'>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className='rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none'
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>

        <button
          type='button'
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className='flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer'
        >
          <ChevronLeft size={16} />
        </button>

        <span className='text-xs font-bold text-slate-700'>
          {page} / {totalPages || 1}
        </span>

        <button
          type='button'
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className='flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer'
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
