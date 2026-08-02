import { useMemo, useState } from 'react';
import type { Movement, MovementType } from '../../../services/movement';
import { MovementTableFilter } from './movement-table-filter';
import { MovementTablePagination } from './movement-table-pagination';
import { MovementTableRow } from './movement-table-row';

interface Props {
  readonly movements: Movement[];
  readonly isLoading?: boolean;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const MovementTable = ({ movements, isLoading }: Props) => {
  const [type, setType] = useState<MovementType | 'ALL'>('ALL');
  const [damagedOnly, setDamagedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredMovements = useMemo(() => {
    return movements.filter((item) => {
      const matchType = type === 'ALL' || item.type === type;
      const isItemDamaged = Boolean(
        item.isDamaged || item.reference?.toLowerCase() === 'damage',
      );
      const matchDamage = damagedOnly ? isItemDamaged : true;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.product?.name?.toLowerCase().includes(q) ||
        item.reference?.toLowerCase().includes(q) ||
        item.note?.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q);

      return matchType && matchDamage && matchSearch;
    });
  }, [movements, type, damagedOnly, searchQuery]);

  const totalPages = Math.ceil(filteredMovements.length / pageSize) || 1;
  const paginatedData = filteredMovements.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td
            colSpan={7}
            className='p-10 text-center text-slate-400 font-medium'
          >
            Loading stock movements...
          </td>
        </tr>
      );
    }

    if (paginatedData.length === 0) {
      return (
        <tr>
          <td
            colSpan={7}
            className='p-12 text-center text-slate-500 font-medium'
          >
            No movement records found matching criteria.
          </td>
        </tr>
      );
    }

    return paginatedData.map((item) => (
      <MovementTableRow key={item.id} item={item} />
    ));
  };

  return (
    <div className='space-y-6 rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs min-w-0 w-full max-w-full overflow-hidden'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>
          Stock Movement History
        </h1>
        <p className='text-sm text-slate-500'>
          Track inventory restocks, sales transactions, customer returns, and
          damaged stock writes.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <MovementTableFilter
        selectedType={type}
        onTypeChange={(t) => {
          setType(t);
          setPage(1);
        }}
        damagedOnly={damagedOnly}
        onToggleDamaged={() => {
          setDamagedOnly(!damagedOnly);
          setPage(1);
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
      />

      {/* Responsive Table View */}
      <div className='overflow-x-auto rounded-2xl border border-slate-100 min-w-0 w-full'>
        <table className='w-full border-collapse text-left text-sm'>
          <thead>
            <tr className='border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500'>
              <th className='px-5 py-3.5'>Product</th>
              <th className='px-5 py-3.5'>Type</th>
              <th className='px-5 py-3.5 text-center'>Quantity</th>
              <th className='px-5 py-3.5 text-center'>Remaining Stock</th>
              <th className='px-5 py-3.5'>Condition</th>
              <th className='px-5 py-3.5'>Reference / Note</th>
              <th className='px-5 py-3.5 text-right'>Date & Time</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100'>
            {renderTableBody()}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <MovementTablePagination
        page={page}
        totalPages={totalPages}
        totalItems={filteredMovements.length}
        pageSize={pageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
      />
    </div>
  );
};

export default MovementTable;
