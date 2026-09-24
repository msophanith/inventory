import { useQuery } from '@tanstack/react-query';
import { DollarSign, History, ShoppingBag, ShoppingBasket } from 'lucide-react';
import { movementService } from '../../../services';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';
import { useLanguage } from '../../../i18n/language-context';

interface PosHeaderBannerProps {
  readonly onOpenReceiptHistory?: () => void;
}

export function PosHeaderBanner({
  onOpenReceiptHistory,
}: PosHeaderBannerProps = {}) {
  const { t } = useLanguage();
  const { data: todaySummary } = useQuery({
    queryKey: ['today-sales'],
    queryFn: () => movementService.getTodaySale(),
    refetchInterval: 15000,
  });

  const salesUsd = todaySummary?.totalSales || 0;
  const ordersCount = todaySummary?.totalOrders || 0;

  return (
    <div className='rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-3 sm:p-5 text-white shadow-xl border border-indigo-500/20'>
      {/* Mobile Streamlined View (< sm) */}
      <div className='flex sm:hidden items-center justify-between gap-2'>
        <div className='flex items-center gap-2 min-w-0'>
          <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0'>
            <ShoppingBasket size={16} className='animate-pulse' />
          </div>
          <div className='min-w-0'>
            <div className='flex items-center gap-1.5'>
              <h2 className='text-sm font-black tracking-tight truncate'>
                {t('pos.posTerminal')}
              </h2>
              <span className='h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0' />
            </div>
            <p className='text-[10px] text-emerald-400 font-extrabold truncate'>
              {formatCurrencyUsd(salesUsd)}{' '}
              <span className='text-slate-400 font-normal'>• {ordersCount} {t('pos.todayOrders')}</span>
            </p>
          </div>
        </div>

        {onOpenReceiptHistory && (
          <button
            type='button'
            onClick={onOpenReceiptHistory}
            title={t('pos.receiptHistory')}
            className='flex h-8 items-center gap-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 text-xs font-bold text-white transition active:scale-95 cursor-pointer shrink-0'
          >
            <History size={14} />
            <span className='text-[11px]'>{t('pos.receiptHistory')}</span>
          </button>
        )}
      </div>

      {/* Desktop / Tablet Full Banner (>= sm) */}
      <div className='hidden sm:flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-inner'>
            <ShoppingBasket size={22} className='animate-pulse' />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <h2 className='text-lg font-black tracking-wide'>
                {t('pos.posTerminal')}
              </h2>
              <span className='rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider'>
                {t('pos.liveReady')}
              </span>
              {onOpenReceiptHistory && (
                <button
                  type='button'
                  onClick={onOpenReceiptHistory}
                  className='flex items-center gap-1 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 border border-emerald-400/30 px-2.5 py-1 text-xs font-bold text-white transition cursor-pointer'
                >
                  <History size={13} /> {t('pos.receiptHistory')}
                </button>
              )}
            </div>
            <p className='text-xs text-slate-300 font-medium mt-0.5'>
              {t('pos.scanToRingUp')}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-4 sm:gap-6 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-md border border-white/10 shadow-inner'>
          <div className='flex items-center gap-2.5'>
            <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400'>
              <DollarSign size={16} />
            </div>
            <div>
              <p className='text-[10px] uppercase font-bold text-slate-300 tracking-wider'>
                {t('pos.todayRevenue')}
              </p>
              <p className='text-xs sm:text-sm font-black text-emerald-400 leading-tight'>
                {formatCurrencyUsd(salesUsd)}{' '}
                <span className='text-[10px] font-bold text-indigo-300'>
                  ({formatCurrencyKhr(salesUsd)})
                </span>
              </p>
            </div>
          </div>

          <div className='h-7 w-px bg-white/20' />

          <div className='flex items-center gap-2.5'>
            <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400'>
              <ShoppingBag size={16} />
            </div>
            <div>
              <p className='text-[10px] uppercase font-bold text-slate-300 tracking-wider'>
                {t('pos.todayOrders')}
              </p>
              <p className='text-xs sm:text-sm font-black text-white leading-tight'>
                {t('pos.salesCount').replace('{count}', ordersCount.toString())}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
