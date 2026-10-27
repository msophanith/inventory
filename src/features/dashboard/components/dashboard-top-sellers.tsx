import { useQuery } from '@tanstack/react-query';
import { Trophy, Calendar } from 'lucide-react';
import { movementService } from '@/services';
import type { MonthTopSellerItem } from '@/services/movement';
import { formatCurrencyKhr, formatCurrencyUsd } from '@/utils/currency';
import { useLanguage } from '@/i18n/language-context';

interface Props {
  readonly items?: MonthTopSellerItem[];
  readonly isLoading?: boolean;
}

function getRankBadge(index: number) {
  if (index === 0) return 'bg-amber-500 text-white shadow-2xs';
  if (index === 1) return 'bg-slate-700 text-white';
  if (index === 2) return 'bg-amber-700 text-white';
  return 'bg-slate-100 text-slate-600';
}

export function DashboardTopSellers({
  items,
  isLoading: propLoading,
}: Props) {
  const { t } = useLanguage();

  const { data: queryData = [], isLoading: queryLoading } = useQuery<
    MonthTopSellerItem[]
  >({
    queryKey: ['month-top-sellers'],
    queryFn: () => movementService.getMonthTopSellers(6),
    staleTime: 60 * 1000,
    enabled: items === undefined,
  });

  const topSellers = items ?? queryData;
  const isLoading = propLoading ?? queryLoading;
  const maxQty = topSellers[0]?.qtySold || 1;

  if (isLoading) {
    return <div className='h-full min-h-90 animate-pulse rounded-3xl bg-slate-100' />;
  }

  return (
    <div className='flex h-full flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs transition hover:shadow-xs'>
      {/* Header */}
      <div className='flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60'>
            <Trophy size={18} />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <h2 className='text-sm sm:text-base font-black text-slate-900 tracking-tight'>
                {t('reports.topBestSellers')}
              </h2>
              <span className='inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200/60'>
                <Calendar size={10} />
                <span>{t('reports.thisMonth')}</span>
              </span>
            </div>
            <p className='text-xs text-slate-500 font-medium'>
              {t('reports.topSellersThisMonth')}
            </p>
          </div>
        </div>
      </div>

      {/* List */}
      {topSellers.length === 0 ? (
        <div className='py-16 text-center text-xs text-slate-400 font-semibold'>
          {t('reports.noSalesDataYet')}
        </div>
      ) : (
        <div className='space-y-3 pt-3 flex-1 flex flex-col justify-around'>
          {topSellers.map((item, i) => (
            <div
              key={item.productId}
              className='flex items-center gap-3 p-1.5 rounded-2xl transition-colors hover:bg-slate-50'
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-black ${getRankBadge(i)}`}
              >
                {i + 1}
              </div>

              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between gap-2 mb-1'>
                  <div className='flex items-center gap-2 truncate'>
                    <span className='text-xs font-bold text-slate-900 truncate'>
                      {item.name}
                    </span>
                    <span className='rounded-md bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-500 shrink-0'>
                      {item.category}
                    </span>
                  </div>
                  <span className='text-xs font-black text-slate-900 tabular-nums shrink-0'>
                    {t('reports.soldCount', { count: item.qtySold })}
                  </span>
                </div>

                <div className='relative h-1.5 w-full rounded-full bg-slate-100 overflow-hidden'>
                  <div
                    className='absolute left-0 top-0 h-full rounded-full bg-indigo-500 transition-all duration-500'
                    style={{ width: `${(item.qtySold / maxQty) * 100}%` }}
                  />
                </div>

                <div className='mt-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-400'>
                  <span className='text-slate-700 font-bold tabular-nums'>
                    {formatCurrencyUsd(item.revenue)}
                  </span>
                  <span>•</span>
                  <span className='text-indigo-600 font-semibold'>
                    {formatCurrencyKhr(item.revenue)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
