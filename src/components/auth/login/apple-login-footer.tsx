import { Heart } from 'lucide-react';
import { useLanguage } from '@/i18n/language-context';
import { getAppVersion } from '@/utils/version';

export function AppleLoginFooter() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className='mt-8 text-center space-y-2 text-xs text-slate-500 font-normal'>
      <div className='flex items-center justify-center gap-2 flex-wrap'>
        <span className='font-semibold text-slate-700'>
          © {currentYear} {t('common.appName')}
        </span>
        <span>·</span>
        <span>{t('common.copyright')}</span>
        <span>·</span>
        <span className='font-mono text-[10px] bg-white/80 px-2 py-0.5 rounded-full border border-slate-200/80 text-slate-600 shadow-2xs'>
          {getAppVersion(true)}
        </span>
      </div>
      <p className='flex items-center justify-center gap-1.5 text-[11px] text-slate-400'>
        <span>{t('common.developedBy')}</span>
        <span className='font-semibold text-slate-700 hover:text-blue-600 transition-colors'>
          Sophanith Mey
        </span>
        <Heart size={11} className='text-rose-500 fill-rose-500 inline-block' />
      </p>
    </footer>
  );
}
