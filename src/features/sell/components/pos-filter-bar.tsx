import { Camera, Search, X } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';

interface Props {
  readonly search: string;
  readonly onSearchChange: (val: string) => void;
  readonly selectedCategory: string;
  readonly onCategoryChange: (cat: string) => void;
  readonly categories: string[];
  readonly onOpenScanModal: () => void;
}

export function PosFilterBar({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onOpenScanModal,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className='space-y-2.5 w-full min-w-0'>
      {/* Search Input & Camera Scanner Button */}
      <div className='flex items-center gap-2 w-full min-w-0'>
        <div className='relative flex-1 min-w-0'>
          <Search
            size={18}
            className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
          />
          <input
            type='text'
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('pos.searchPlaceholder')}
            className='w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs transition-all'
          />
          {search && (
            <button
              type='button'
              onClick={() => onSearchChange('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition'
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          type='button'
          onClick={onOpenScanModal}
          title={t('pos.cameraScanner')}
          className='flex h-10 items-center justify-center gap-1.5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 px-3.5 text-xs font-black text-white shadow-md hover:from-emerald-700 hover:to-teal-700 transition active:scale-95 cursor-pointer shrink-0'
        >
          <Camera size={16} />
          <span className='hidden sm:inline'>{t('pos.cameraScanner')}</span>
        </button>
      </div>

      {/* Category Pills Slider */}
      <div className='flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 w-full max-w-full no-scrollbar'>
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`flex items-center rounded-xl px-3 py-1.5 text-xs font-extrabold whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer shrink-0 ${
                active
                  ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <span>{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
