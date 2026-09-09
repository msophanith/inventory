import { useLanguage } from '../../i18n/language-context';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className='flex items-center p-0.5 rounded-full bg-slate-100/90 border border-slate-200/70 shadow-2xs'>
      <button
        type='button'
        onClick={() => setLanguage('km')}
        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-all cursor-pointer ${
          language === 'km'
            ? 'bg-white text-slate-900 font-black shadow-xs ring-1 ring-black/5'
            : 'text-slate-500 hover:text-slate-800 font-bold hover:bg-slate-200/40'
        }`}
      >
        <span className='text-xs'>🇰🇭</span>
        <span>ខ្មែរ</span>
      </button>

      <button
        type='button'
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-white text-slate-900 font-black shadow-xs ring-1 ring-black/5'
            : 'text-slate-500 hover:text-slate-800 font-bold hover:bg-slate-200/40'
        }`}
      >
        <span className='text-xs'>🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
}
