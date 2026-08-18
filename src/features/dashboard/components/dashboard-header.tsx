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
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white shadow-xl border border-indigo-500/20'>
      {/* Title & Greeting */}
      <div className='flex items-center gap-3.5'>
        <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-inner shrink-0'>
          <Sparkles size={24} className='animate-pulse' />
        </div>
        <div>
          <div className='flex items-center gap-2 flex-wrap'>
            <h1 className='text-lg sm:text-xl font-black tracking-wide'>
              {getGreeting()},{' '}
              <span className='capitalize text-indigo-300'>{username}</span>
            </h1>
            <span className='rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider hidden sm:inline-block'>
              {t('reports.systemReady')}
            </span>
          </div>
          <div className='flex items-center gap-2 text-xs text-slate-300 font-medium mt-0.5'>
            <span className='flex items-center gap-1 text-indigo-300 font-semibold'>
              <Calendar size={13} /> {todayDateStr}
            </span>
            <span>•</span>
            <span>{t('reports.analyticsDesc')}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Commands */}
      <div className='flex items-center gap-2 shrink-0'>
        <button
          type='button'
          onClick={() => navigate('/sell')}
          className='flex items-center gap-1.5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-black text-white shadow-md hover:from-emerald-700 hover:to-teal-700 transition cursor-pointer active:scale-95'
        >
          <ShoppingCart size={16} />
          <span>{t('reports.posTerminal')}</span>
        </button>

        <button
          type='button'
          onClick={() => navigate('/scan')}
          className='flex items-center gap-1.5 rounded-2xl bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-400/30 px-3.5 py-2.5 text-xs font-black text-white transition cursor-pointer active:scale-95'
        >
          <Camera size={16} />
          <span className='hidden sm:inline'>{t('pos.scanBarcode')}</span>
        </button>

        <button
          type='button'
          onClick={() => navigate('/products/create')}
          className='flex items-center gap-1.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-2.5 text-xs font-black text-white transition cursor-pointer active:scale-95'
        >
          <Plus size={16} />
          <span className='hidden sm:inline'>{t('products.addProduct')}</span>
        </button>
      </div>
    </div>
  );
}
