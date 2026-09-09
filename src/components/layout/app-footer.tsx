import { Heart } from 'lucide-react';
import { useLanguage } from '../../i18n/language-context';

export function AppFooter() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className='w-full border-t border-slate-200/60 bg-white/50 backdrop-blur-xs py-3.5 px-4 sm:px-6 lg:px-8 mt-auto'>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-medium'>
        {/* Left: Copyright & App Identity */}
        <div className='flex items-center gap-1.5 text-center sm:text-left flex-wrap justify-center sm:justify-start'>
          <span className='font-bold text-slate-700'>
            © {currentYear} {t('common.appName')}
          </span>
          <span className='hidden sm:inline text-slate-300'>·</span>
          <span>{t('common.copyright')}</span>
        </div>

        {/* Right: Developer Attribution & Version */}
        <div className='flex items-center gap-2 text-slate-500'>
          <span className='flex items-center gap-1'>
            <span>{t('common.developedBy')}</span>
            <span className='font-bold text-slate-800 hover:text-indigo-600 transition-colors'>
              Sophanith Mey
            </span>
            <Heart size={12} className='text-rose-500 fill-rose-500 inline-block ml-0.5' />
          </span>
          <span className='text-slate-300'>·</span>
          <span className='font-mono text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded'>
            v1.0.2
          </span>
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
