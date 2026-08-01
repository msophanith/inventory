import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Table } from '@tanstack/react-table';
import type { Product } from '../../../services/product';

interface Props {
  readonly table: Table<Product>;
  readonly pageIndex: number;
  readonly pageSize: number;
  readonly pageCount: number;
  readonly totalRows: number;
}

export function ProductTablePagination({
  table,
  pageIndex,
  pageSize,
  pageCount,
  totalRows,
}: Props) {
  const startRow = totalRows > 0 ? pageIndex * pageSize + 1 : 0;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-slate-100 text-sm text-slate-500 font-medium'>
      <p>
        Showing <span className='font-bold text-slate-900'>{startRow}-{endRow}</span> of <span className='font-bold text-slate-900'>{totalRows}</span> products
      </p>

      <div className='flex items-center gap-3 self-end sm:self-auto'>
        <button
          type='button'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className='flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer'
        >
          <ChevronLeft size={18} />
        </button>

        <span className='text-sm font-semibold text-slate-700'>
          Page {pageIndex + 1} of {pageCount || 1}
        </span>

        <button
          type='button'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className='flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer'
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
