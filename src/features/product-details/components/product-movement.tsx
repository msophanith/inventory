import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, History, Search } from 'lucide-react';
import { formatDateTime } from '../../../utils/date';
import type { Movement, MovementType } from '../../../services/movement';
import MovementBadge from '../../movement/components/movement-badge';

interface Props {
  readonly movements: Movement[];
}

const PAGE_SIZE = 10;

const ProductMovementHistory = ({ movements }: Props) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | MovementType>('ALL');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return movements.filter((item) => {
      const matchType = filter === 'ALL' || item.type === filter;
      const matchSearch =
        !search.trim() ||
        item.note?.toLowerCase().includes(search.toLowerCase()) ||
        item.reference?.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
  }, [movements, filter, search]);

  const totalPage = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const data = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className='rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-4 min-w-0 w-full'>
      {/* Header & Controls */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600'>
            <History size={18} />
          </div>
          <div>
            <h2 className='font-bold text-slate-900 text-base'>Stock Movement History</h2>
            <p className='text-xs text-slate-400 font-medium'>Audit trail of transactions</p>
          </div>
        </div>

        <div className='relative w-full sm:w-60'>
          <Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder='Search notes...'
            className='h-9 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className='flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide'>
        {(['ALL', 'IN', 'OUT', 'RETURN'] as const).map((type) => (
          <button
            key={type}
            onClick={() => {
              setFilter(type);
              setPage(1);
            }}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              filter === type
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Responsive Table */}
      <div className='overflow-x-auto rounded-2xl border border-slate-100 min-w-0 w-full'>
        <table className='w-full border-collapse text-left text-xs'>
          <thead>
            <tr className='border-b border-slate-200 bg-slate-50/80 font-bold uppercase tracking-wider text-slate-500'>
              <th className='px-4 py-3'>Type</th>
              <th className='px-4 py-3'>Qty</th>
              <th className='px-4 py-3'>Reference / Note</th>
              <th className='px-4 py-3 text-right'>Date</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100'>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className='p-8 text-center text-slate-400 font-medium'>
                  No stock movement history recorded.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className='hover:bg-slate-50/70 transition-colors'>
                  <td className='px-4 py-3'>
                    <MovementBadge type={item.type} />
                  </td>
                  <td className='px-4 py-3 font-extrabold text-slate-900'>{item.quantity}</td>
                  <td className='px-4 py-3 text-slate-600 font-medium max-w-xs truncate'>
                    {item.reference || item.note || '-'}
                  </td>
                  <td className='px-4 py-3 text-right text-slate-400 font-mono'>
                    {formatDateTime(item.createdAt, 'MMM dd, yyyy HH:mm', '-')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between text-xs font-semibold text-slate-500 pt-1'>
        <span>Showing {data.length} of {filtered.length} entries</span>
        <div className='flex items-center gap-2'>
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className='flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer'
          >
            <ChevronLeft size={16} />
          </button>
          <span>{page} / {totalPage}</span>
          <button
            disabled={page >= totalPage}
            onClick={() => setPage(page + 1)}
            className='flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer'
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductMovementHistory;
