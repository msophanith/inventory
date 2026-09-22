import { useLanguage } from '../../i18n/language-context';

interface Props {
  readonly className?: string;
}

export function LanguageSelector({ className = '' }: Props) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`flex items-center p-0.5 rounded-full bg-slate-100/90 border border-slate-200/70 shadow-2xs shrink-0 select-none ${className}`}
      role='group'
      aria-label='Language selector'
    >
      <button
        type='button'
        onClick={() => setLanguage('km')}
        title='ប្តូរទៅភាសាខ្មែរ (Khmer)'
        className={`flex items-center gap-1 rounded-full px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs transition-all cursor-pointer active:scale-95 ${
          language === 'km'
            ? 'bg-white text-slate-900 font-black shadow-xs ring-1 ring-black/5'
            : 'text-slate-500 hover:text-slate-800 font-bold hover:bg-slate-200/40'
        }`}
      >
        <span className='text-xs shrink-0' aria-hidden='true'>🇰🇭</span>
        <span className='font-black tracking-tight'>ខ្មែរ</span>
      </button>

      <button
        type='button'
        onClick={() => setLanguage('en')}
        title='Switch to English'
        className={`flex items-center gap-1 rounded-full px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs transition-all cursor-pointer active:scale-95 ${
          language === 'en'
            ? 'bg-white text-slate-900 font-black shadow-xs ring-1 ring-black/5'
            : 'text-slate-500 hover:text-slate-800 font-bold hover:bg-slate-200/40'
        }`}
      >
        <span className='text-xs shrink-0' aria-hidden='true'>🇬🇧</span>
        <span className='font-black tracking-tight'>EN</span>
      </button>
    </div>
  );
}
