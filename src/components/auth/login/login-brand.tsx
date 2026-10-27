import { Store } from 'lucide-react';
import { useLanguage } from '@/i18n/language-context';

export function LoginBrand() {
  const { t } = useLanguage();

  return (
    <div className='mb-7 space-y-3 text-left'>
      {/* Brand lockup */}
      <div className='flex items-center gap-3'>
        <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 via-indigo-700 to-blue-600 text-white shadow-md shadow-indigo-600/20'>
          <Store size={22} className='stroke-[2.2]' />
        </div>
        <div>
          <div className='flex items-center gap-1.5'>
            <span className='text-lg font-black tracking-tight text-slate-900'>
              {t('common.appName')}
            </span>
            <span className='rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200/60'>
              POS
            </span>
          </div>
          <p className='text-[11px] font-semibold text-slate-500'>
            មានលាភ · Retail Terminal
          </p>
        </div>
      </div>

      {/* Greeting Title */}
      <div className='pt-1'>
        <h2 className='text-xl sm:text-2xl font-black tracking-tight text-slate-900'>
          {t('auth.signInTitle')}
        </h2>
        <p className='text-xs text-slate-500 font-medium leading-relaxed mt-1'>
          {t('auth.portalSubtitle')}
        </p>
      </div>
    </div>
  );
}
