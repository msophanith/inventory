import { useNavigate } from 'react-router-dom';
import { Camera, Calendar, Plus, ShoppingCart, Sparkles } from 'lucide-react';
import { useAuth } from '../../auth/use-auth';
import { formatDate } from '../../../utils/date';
import { useLanguage } from '../../../i18n/language-context';

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

  const username = user?.email ? user.email.split('@')[0] : 'Manager';
  const todayDateStr = formatDate(new Date(), 'EEEE, dd MMM yyyy');

  return (
    <div className='relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-6 text-white shadow-xl'>
      {/* Decorative ambient background glows */}
      <div className='pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl' />
      <div className='pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl' />

      <div className='relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
        {/* Title & User Greeting */}
        <div className='flex items-center gap-4'>
          <div className='flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/20 text-indigo-300 shadow-inner backdrop-blur-md'>
            <Sparkles size={24} className='animate-pulse' />
          </div>

          <div>
            <div className='flex flex-wrap items-center gap-2'>
              <h1 className='text-xl sm:text-2xl font-black tracking-tight'>
                {getGreeting()},{' '}
                <span className='capitalize text-indigo-300'>{username}</span>
              </h1>
              <span className='inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-400'>
                <span className='h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping' />
                {t('reports.systemReady')}
              </span>
            </div>

            <div className='mt-1 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-300'>
              <span className='flex items-center gap-1.5 font-semibold text-indigo-200'>
                <Calendar size={13} /> {todayDateStr}
              </span>
              <span>•</span>
              <span className='text-slate-400'>{t('reports.analyticsDesc')}</span>
            </div>
          </div>
        </div>

        {/* Quick Launchpad Buttons */}
        <div className='flex flex-wrap items-center gap-2.5 shrink-0'>
          <button
            type='button'
            onClick={() => navigate('/sell')}
            className='flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-emerald-900/30 transition-all hover:from-emerald-600 hover:to-teal-700 active:scale-95 cursor-pointer'
          >
            <ShoppingCart size={16} />
            <span>{t('reports.posTerminal')}</span>
          </button>

          <button
            type='button'
            onClick={() => navigate('/scan')}
            className='flex items-center gap-1.5 rounded-2xl border border-indigo-400/30 bg-indigo-600/70 px-3.5 py-2.5 text-xs font-black text-white backdrop-blur-md transition-all hover:bg-indigo-600 active:scale-95 cursor-pointer'
          >
            <Camera size={16} />
            <span>{t('pos.scanBarcode')}</span>
          </button>

          <button
            type='button'
            onClick={() => navigate('/products/create')}
            className='flex items-center gap-1.5 rounded-2xl border border-slate-700/80 bg-slate-800/80 px-3.5 py-2.5 text-xs font-black text-white backdrop-blur-md transition-all hover:bg-slate-700 active:scale-95 cursor-pointer'
          >
            <Plus size={16} />
            <span>{t('products.addProduct')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
