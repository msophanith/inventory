import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, History, Search } from 'lucide-react';
import { formatDateTime } from '../../../utils/date';
import type { Movement, MovementType } from '../../../services/movement';
import MovementBadge from '../../movement/components/movement-badge';
import { useLanguage } from '../../../i18n/language-context';

export default function ProductMovementHistory({
  movements,
}: {
  movements: Movement[];
}) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | MovementType>('ALL');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filteredData = useMemo(() => {
    return movements.filter((item) => {
      const matchType = filter === 'ALL' || item.type === filter;
      const matchSearch =
        !search.trim() ||
        item.note?.toLowerCase().includes(search.toLowerCase()) ||
        item.reference?.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
  }, [movements, filter, search]);

  const totalPage = Math.ceil(filteredData.length / PAGE_SIZE) || 1;
  const paginatedData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className='rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-4 min-w-0 w-full'>
      {/* Header & Controls */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600'>
            <History size={18} />
          </div>
          <div>
            <h2 className='font-bold text-slate-900 text-base'>{t('movement.history')}</h2>
            <p className='text-xs text-slate-400 font-medium'>{t('movement.auditTrail')}</p>
          </div>
        </div>

        <div className='relative w-full sm:w-60'>
          <Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('common.search')}
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
            {type === 'ALL'
              ? t('common.all')
              : type === 'IN'
                ? t('movement.in')
                : type === 'OUT'
                  ? t('movement.out')
                  : t('movement.return')}
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
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={4} className='p-8 text-center text-slate-400 font-medium'>
                  <div className='flex flex-col items-center justify-center p-8 sm:p-12 text-center'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400'>
                      <History size={24} />
                    </div>
                    <p className='mt-3 text-sm font-bold text-slate-600'>{t('common.noData')}</p>
                    <p className='mt-1 text-xs text-slate-400'>
                      {search ? t('movement.noRecordsMatch') : t('movement.noActivityYet')}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.id} className='hover:bg-slate-50/70 transition-colors'>
                  <td className='px-4 py-3'>
                    <MovementBadge type={item.type} />
                  </td>
                  <td className='px-4 py-3'>
                    <span className='font-bold text-slate-700 text-sm'>
                      {item.type === 'OUT' ? '-' : '+'}
                      {item.quantity}
                    </span>
                    <span className='ml-1 text-[10px] text-slate-400 uppercase tracking-wider font-semibold'>
                      {t('products.units')}
                    </span>
                  </td>
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
        <span>Showing {paginatedData.length} of {filteredData.length} entries</span>
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


