import { useState, useMemo } from 'react';
import { Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/language-context';
import type { Movement } from '@/services/movement';
import { RecentActivityRow } from './recent-activity-row';

interface Props {
  readonly movements?: Movement[];
  readonly isLoading?: boolean;
}

type FilterType = 'ALL' | 'OUT' | 'IN' | 'RETURN';

export function DashboardRecentActivity({
  movements = [],
  isLoading = false,
}: Props) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<FilterType>('ALL');

  const filteredMovements = useMemo(() => {
    if (filter === 'ALL') return movements.slice(0, 6);
    return movements.filter((m) => m.type === filter).slice(0, 6);
  }, [movements, filter]);

  return (
    <div className='flex h-full flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs transition hover:shadow-xs'>
      {/* Header & Filter Row */}
      <div className='flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 border border-slate-200'>
            <Activity size={18} />
          </div>
          <div>
            <h3 className='text-sm sm:text-base font-black text-slate-900 tracking-tight'>
              {t('reports.recentActivity')}
            </h3>
            <p className='text-xs text-slate-500 font-medium'>
              {t('reports.analyticsDesc')}
            </p>
          </div>
        </div>

        {/* Filter Pills & View All */}
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200/60'>
            {(['ALL', 'OUT', 'IN', 'RETURN'] as FilterType[]).map((type) => (
              <button
                key={type}
                type='button'
                onClick={() => setFilter(type)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                  filter === type
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {type === 'ALL'
                  ? t('common.all')
                  : type === 'OUT'
                    ? t('movement.out')
                    : type === 'IN'
                      ? t('movement.in')
                      : t('movement.return')}
              </button>
            ))}
          </div>

          <Link
            to='/movement'
            className='flex items-center gap-1 rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer border border-slate-200/60'
          >
            <span>{t('common.viewDetails')}</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className='space-y-3 pt-3'>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className='h-12 animate-pulse rounded-2xl bg-slate-100'
            />
          ))}
        </div>
      ) : filteredMovements.length === 0 ? (
        <p className='py-12 text-center text-xs text-slate-400 font-semibold'>
          {t('reports.noSalesDataYet')}
        </p>
      ) : (
        <div className='divide-y divide-slate-100 pt-1'>
          {filteredMovements.map((m) => (
            <RecentActivityRow key={m.id} movement={m} />
          ))}
        </div>
      )}
    </div>
  );
}
