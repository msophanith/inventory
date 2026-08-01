import { useQuery } from '@tanstack/react-query';
import { DollarSign, Scan, ShoppingBag, Sparkles } from 'lucide-react';
import { movementService } from '../../../services';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';

interface PosHeaderBannerProps {
  onOpenScanModal?: () => void;
}

export function PosHeaderBanner({ onOpenScanModal }: PosHeaderBannerProps = {}) {
  const { data: todaySummary } = useQuery({
    queryKey: ['today-sales'],
    queryFn: () => movementService.getTodaySale(),
    refetchInterval: 15000,
  });

  const salesUsd = todaySummary?.totalSales || 0;
  const ordersCount = todaySummary?.totalOrders || 0;

  return (
    <div className='flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-5 text-white shadow-xl border border-indigo-500/20'>
      {/* Title & Live Status */}
      <div className='flex items-center gap-3'>
        <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-inner'>
          <Sparkles size={22} className='animate-pulse' />
        </div>
        <div>
          <div className='flex items-center gap-2'>
            <h2 className='text-base sm:text-lg font-black tracking-wide'>
              POS Terminal
            </h2>
            <span className='rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider'>
              Live Ready
            </span>
            {onOpenScanModal && (
              <button
                type='button'
                onClick={onOpenScanModal}
                className='flex items-center gap-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-400/30 px-2 py-0.5 text-[11px] font-bold text-white transition cursor-pointer'
              >
                <Scan size={12} /> Camera Scan
              </button>
            )}
          </div>
          <p className='text-xs text-slate-300 font-medium'>
            Scan or click products to ring up sales
          </p>
        </div>
      </div>

      {/* Today Sales Stat Pill */}
      <div className='flex items-center gap-4 sm:gap-6 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-md border border-white/10 shadow-inner'>
        <div className='flex items-center gap-2.5'>
          <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400'>
            <DollarSign size={16} />
          </div>
          <div>
            <p className='text-[10px] uppercase font-bold text-slate-300 tracking-wider'>
              Today Revenue
            </p>
            <p className='text-xs sm:text-sm font-black text-emerald-400 leading-tight'>
              {formatCurrencyUsd(salesUsd)}{' '}
              <span className='text-[10px] font-bold text-indigo-300'>
                ({formatCurrencyKhr(salesUsd)})
              </span>
            </p>
          </div>
        </div>

        <div className='h-7 w-[1px] bg-white/20' />

        <div className='flex items-center gap-2.5'>
          <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400'>
            <ShoppingBag size={16} />
          </div>
          <div>
            <p className='text-[10px] uppercase font-bold text-slate-300 tracking-wider'>
              Today Orders
            </p>
            <p className='text-xs sm:text-sm font-black text-white leading-tight'>
              {ordersCount} Sales
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
