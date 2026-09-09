import { useMemo } from 'react';
import { Trophy } from 'lucide-react';
import type { Movement } from '../../../services/movement';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';
import { useLanguage } from '../../../i18n/language-context';

interface Props {
  readonly movements?: Movement[];
  readonly isLoading?: boolean;
}

interface SellerItem {
  productId: string;
  name: string;
  category: string;
  qtySold: number;
  revenue: number;
}

function aggregateTopSellers(movements: Movement[]): SellerItem[] {
  const map = new Map<string, SellerItem>();

  movements.forEach((m) => {
    if (m.type !== 'OUT' || m.isDamaged || !m.product) return;
    const id = m.productId || m.product.id;
    const qty = Math.abs(m.quantity || 0);
    const rev = qty * (m.unitPrice ?? m.product.sellPrice ?? 0);

    const existing = map.get(id) ?? {
      productId: id,
      name: m.product.name,
      category: m.product.category || 'General',
      qtySold: 0,
      revenue: 0,
    };
    existing.qtySold += qty;
    existing.revenue += rev;
    map.set(id, existing);
  });

  return Array.from(map.values())
    .sort((a, b) => b.qtySold - a.qtySold)
    .slice(0, 10);
}

function getRankBadge(index: number) {
  if (index === 0) {
    return 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-xs';
  }
  if (index === 1) {
    return 'bg-gradient-to-br from-slate-400 to-slate-500 text-white shadow-xs';
  }
  if (index === 2) {
    return 'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-xs';
  }
  return 'bg-slate-100 text-slate-600';
}

export function DashboardTopSellers({ movements = [], isLoading }: Props) {
  const { t } = useLanguage();
  const topSellers = useMemo(() => aggregateTopSellers(movements), [movements]);
  const maxQty = topSellers[0]?.qtySold || 1;

  if (isLoading) {
    return <div className='h-72 animate-pulse rounded-3xl bg-slate-100' />;
  }

  return (
    <div className='rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4 transition hover:shadow-md'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-slate-100 pb-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100'>
            <Trophy size={20} />
          </div>
          <div>
            <h2 className='text-sm sm:text-base font-extrabold text-slate-900'>
              {t('reports.topBestSellers')}
            </h2>
            <p className='text-xs text-slate-500 font-medium'>
              {t('reports.rankedByUnits')}
            </p>
          </div>
        </div>
      </div>

      {/* List */}
      {topSellers.length === 0 ? (
        <div className='py-12 text-center text-xs text-slate-400 font-semibold'>
          {t('reports.noSalesDataYet')}
        </div>
      ) : (
        <div className='space-y-3.5'>
          {topSellers.map((item, i) => (
            <div
              key={item.productId}
              className='flex items-center gap-3 p-2 rounded-2xl transition-colors hover:bg-slate-50/80'
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-black ${getRankBadge(i)}`}
              >
                {i + 1}
              </div>

              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between gap-2 mb-1'>
                  <div className='flex items-center gap-2 truncate'>
                    <span className='text-xs font-bold text-slate-900 truncate'>
                      {item.name}
                    </span>
                    <span className='rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 shrink-0'>
                      {item.category}
                    </span>
                  </div>
                  <span className='text-xs font-black text-indigo-600 shrink-0'>
                    {t('pos.itemsCount', { count: item.qtySold })}
                  </span>
                </div>

                <div className='relative h-1.5 w-full rounded-full bg-slate-100 overflow-hidden'>
                  <div
                    className='absolute left-0 top-0 h-full rounded-full bg-indigo-500 transition-all duration-700'
                    style={{ width: `${(item.qtySold / maxQty) * 100}%` }}
                  />
                </div>

                <div className='mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400'>
                  <span className='text-slate-700 font-bold'>
                    {formatCurrencyUsd(item.revenue)}
                  </span>
                  <span>•</span>
                  <span className='text-indigo-600 font-extrabold'>
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
