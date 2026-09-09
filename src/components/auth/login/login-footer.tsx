import { Heart } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';

export function LoginFooter() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <div className='mt-8 text-center space-y-1.5 text-xs text-slate-500 font-medium'>
      <p className='font-bold text-slate-700'>
        © {currentYear} {t('common.appName')} · {t('common.copyright')}
      </p>
      <p className='flex items-center justify-center gap-1.5 text-[11px] text-slate-500'>
        <span>{t('common.developedBy')}</span>
        <span className='font-bold text-slate-800 hover:text-indigo-600 transition-colors'>
          Sophanith Mey
        </span>
        <Heart size={12} className='text-rose-500 fill-rose-500 inline-block' />
        <span className='text-slate-300'>·</span>
        <span className='font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60'>
          v1.0.2
        </span>
      </p>
    </div>
  );
}
