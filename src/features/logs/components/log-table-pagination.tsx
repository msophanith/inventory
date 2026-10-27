import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useActivityLogStore } from '../store/use-activity-log-store';
import { useLanguage } from '@/i18n/language-context';

interface Props {
  page: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

export function LogTablePagination({
  page,
  totalPages,
  totalCount,
  limit,
}: Props) {
  const { t } = useLanguage();
  const setCurrentPage = useActivityLogStore((state) => state.setCurrentPage);

  if (totalCount === 0) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalCount);

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-600'>
      <div>
        {t('common.showingFromToOf', { from, to, total: totalCount })}
      </div>

      <div className='flex items-center gap-2'>
        <button
          type='button'
          onClick={() => setCurrentPage(Math.max(page - 1, 1))}
          disabled={page <= 1}
          className='flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer font-bold'
        >
          <ChevronLeft size={15} />
          <span>{t('common.previous')}</span>
        </button>

        <span className='px-3 py-1.5 rounded-xl bg-slate-100 font-bold text-slate-800'>
          {page} / {Math.max(totalPages, 1)}
        </span>

        <button
          type='button'
          onClick={() => setCurrentPage(Math.min(page + 1, totalPages))}
          disabled={page >= totalPages}
          className='flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer font-bold'
        >
          <span>{t('common.next')}</span>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
