import { Languages, Radio } from 'lucide-react';
import { useLanguage } from '@/i18n/language-context';

export function AppleLoginHeader() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className='flex items-center justify-between gap-3 w-full max-w-md mx-auto mb-6 px-1'>
      {/* Live System Status Pill */}
      <div className='inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3.5 py-1.5 backdrop-blur-2xl shadow-xs'>
        <span className='relative flex h-2 w-2'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
          <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-500' />
        </span>
        <span className='text-[11px] font-semibold tracking-tight text-slate-700 flex items-center gap-1.5'>
          <Radio size={12} className='text-emerald-600' />
          <span>{t('auth.storeEngineOnline')}</span>
        </span>
      </div>

      {/* Apple-style Segmented Language Switcher */}
      <div className='inline-flex items-center rounded-full border border-slate-200/80 bg-white/70 p-1 backdrop-blur-2xl shadow-xs'>
        <Languages size={13} className='text-slate-400 ml-2 mr-1' />
        <button
          type='button'
          onClick={() => setLanguage('en')}
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-all duration-200 cursor-pointer ${
            language === 'en'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          EN
        </button>
        <button
          type='button'
          onClick={() => setLanguage('km')}
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-all duration-200 cursor-pointer ${
            language === 'km'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ខ្មែរ
        </button>
      </div>
    </header>
  );
}
