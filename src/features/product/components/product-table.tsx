import {
  flexRender,
  getCoreRowModel,
  type PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import type { Product } from '../../../services/product';
import { productColumns } from './product-table-columns';
import { ProductTableHeader } from './product-table-header';
import { ProductTablePagination } from './product-table-pagination';

interface Props {
  readonly products: Product[];
  readonly loading?: boolean;
  readonly pagination: PaginationState;
  readonly onPaginationChange: React.Dispatch<
    React.SetStateAction<PaginationState>
  >;
  readonly pageCount: number;
  readonly totalRows: number;
  readonly onSearchChange: (value: string) => void;
  readonly onRowClick?: (productId: string) => void;
  readonly onAddProduct: () => void;
}

export default function ProductTable({
  products,
  loading,
  pagination,
  onPaginationChange,
  pageCount,
  totalRows,
  onSearchChange,
  onRowClick,
  onAddProduct,
}: Props) {
  const table = useReactTable({
    data: products,
    columns: productColumns,
    manualPagination: true,
    pageCount,
    state: { pagination },
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='space-y-6 rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-sm min-w-0 w-full max-w-full overflow-hidden'>
      {/* Search & Actions Header */}
      <ProductTableHeader
        onSearchChange={onSearchChange}
        onAddProduct={onAddProduct}
      />

      {/* Responsive Table Container */}
      <div className='overflow-x-auto rounded-2xl border border-slate-100 min-w-0 w-full'>
        <table className='w-full border-collapse text-left text-sm'>
          <thead>
            <tr className='border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500'>
              {table.getHeaderGroups().map((group) =>
                group.headers.map((header) => (
                  <th key={header.id} className='px-5 py-3.5'>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                )),
              )}
            </tr>
          </thead>

          <tbody className='divide-y divide-slate-100'>
            {loading ? (
              <tr>
                <td colSpan={5} className='p-10 text-center text-slate-400 font-medium'>
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className='p-12 text-center text-slate-500 font-medium'>
                  No products found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original.id)}
                  className='transition-colors hover:bg-slate-50/70 cursor-pointer'
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className='px-5 py-3.5'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <ProductTablePagination
        table={table}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        pageCount={pageCount}
        totalRows={totalRows}
      />
    </div>
  );
}
