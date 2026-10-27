import { Languages } from 'lucide-react';
import { useLanguage } from '@/i18n/language-context';

export function LoginLanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className='inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/80 p-1 backdrop-blur-md shadow-2xs'>
      <div className='flex items-center pl-2 pr-1 text-slate-400'>
        <Languages size={13} />
      </div>
      <button
        type='button'
        onClick={() => setLanguage('en')}
        className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-slate-900 text-white shadow-2xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        EN
      </button>
      <button
        type='button'
        onClick={() => setLanguage('km')}
        className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
          language === 'km'
            ? 'bg-slate-900 text-white shadow-2xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        ខ្មែរ
      </button>
    </div>
  );
}
