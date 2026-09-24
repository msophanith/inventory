import { useState } from 'react';
import { Clipboard, Loader2, Search, X } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';

interface Props {
  readonly onSearch: (code: string) => void;
  readonly isSearching: boolean;
}

export function ScanManualBar({ onSearch, isSearching }: Props) {
  const { t } = useLanguage();
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isSearching) {
      onSearch(value.trim());
    }
  };

  const handlePaste = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text?.trim()) {
          setValue(text.trim());
          onSearch(text.trim());
        }
      }
    } catch (err) {
      console.warn('Clipboard read denied:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='relative flex items-center gap-2'>
      <div className='relative flex-1 min-w-0'>
        <Search
          size={18}
          className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
        />

        <input
          type='text'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t('scan.typeBarcodePlaceholder')}
          className='w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-20 text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-500/15 shadow-2xs transition-all'
        />

        {/* Clear & Paste Quick Buttons inside input */}
        <div className='absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1'>
          {value ? (
            <button
              type='button'
              onClick={() => setValue('')}
              className='p-1 rounded-full text-slate-400 hover:text-slate-600 transition'
            >
              <X size={15} />
            </button>
          ) : (
            <button
              type='button'
              onClick={handlePaste}
              title={t('scan.paste')}
              className='flex items-center gap-1 rounded-xl bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-200 transition active:scale-95 cursor-pointer'
            >
              <Clipboard size={12} />
              <span className='hidden sm:inline'>{t('scan.paste')}</span>
            </button>
          )}
        </div>
      </div>

      <button
        type='submit'
        disabled={!value.trim() || isSearching}
        className='flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-slate-900 px-4 sm:px-5 text-xs font-black text-white shadow-md hover:bg-slate-800 disabled:opacity-50 transition active:scale-95 cursor-pointer shrink-0'
      >
        {isSearching ? (
          <Loader2 size={16} className='animate-spin' />
        ) : (
          <span>{t('scan.search')}</span>
        )}
      </button>
    </form>
  );
}
