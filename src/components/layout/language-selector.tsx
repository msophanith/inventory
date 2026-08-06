import { useLanguage } from '../../i18n/language-context';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className='flex items-center gap-1 rounded-full bg-slate-100/80 border border-slate-200/80 p-1 shadow-2xs'>
      <button
        type='button'
        onClick={() => setLanguage('km')}
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
          language === 'km'
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
      >
        <span className='text-xs'>🇰🇭</span>
        <span>ខ្មែរ</span>
      </button>

      <button
        type='button'
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
      >
        <span className='text-xs'>🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
}
