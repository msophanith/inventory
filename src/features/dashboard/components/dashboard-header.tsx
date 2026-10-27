import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Calendar,
  Plus,
  ShoppingCart,
  HeartHandshake,
} from 'lucide-react';
import { useAuth } from '@/features/auth/use-auth';
import { formatDate } from '@/utils/date';
import { useLanguage } from '@/i18n/language-context';

export function DashboardHeader() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('reports.goodMorning');
    if (hour < 18) return t('reports.goodAfternoon');
    return t('reports.goodEvening');
  };

  const username = user?.fullName || 'Manager';
  const todayDateStr = formatDate(new Date(), 'EEEE, dd MMMM yyyy');

  return (
    <div className='relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs'>
      {/* Subtle architectural gradient accent in background */}
      <div className='pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-50/60 blur-3xl' />
      <div className='pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-50/40 blur-3xl' />

      <div className='relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
        {/* Left: Store Greeting & Status */}
        <div className='flex items-center gap-4'>
          <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm'>
            <HeartHandshake size={22} className='text-amber-300' />
          </div>

          <div>
            <div className='flex flex-wrap items-center gap-2.5'>
              <h1 className='text-xl sm:text-2xl font-black text-slate-900 tracking-tight'>
                {getGreeting()},{' '}
                <span className='capitalize font-bold text-slate-700'>
                  {username}
                </span>
              </h1>
              <span className='inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800'>
                <span className='h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse' />
                {t('reports.systemReady')}
              </span>
            </div>

            <div className='mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium'>
              <span className='flex items-center gap-1.5 font-semibold text-slate-700'>
                <Calendar size={13} className='text-slate-400' /> {todayDateStr}
              </span>
              <span>•</span>
              <span>{t('reports.analyticsDesc')}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Launchpad */}
        <div className='flex flex-wrap items-center gap-2.5 shrink-0'>
          {/* Primary Action: POS Checkout */}
          <button
            type='button'
            onClick={() => navigate('/sell')}
            className='flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-slate-800 active:scale-95 cursor-pointer'
          >
            <ShoppingCart size={15} className='text-emerald-400' />
            <span>{t('reports.posTerminal')}</span>
          </button>

          {/* Secondary Action: Barcode Scan */}
          <button
            type='button'
            onClick={() => navigate('/scan')}
            className='flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 active:scale-95 cursor-pointer'
          >
            <Camera size={15} className='text-slate-500' />
            <span>{t('pos.scanBarcode')}</span>
          </button>

          {/* Secondary Action: Create Product */}
          <button
            type='button'
            onClick={() => navigate('/products/create')}
            className='flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 active:scale-95 cursor-pointer'
          >
            <Plus size={15} className='text-slate-500' />
            <span>{t('products.addProduct')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
