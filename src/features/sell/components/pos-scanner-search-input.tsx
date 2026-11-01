import { useState, useEffect, useRef } from 'react';
import { Barcode, Loader2, Plus, X } from 'lucide-react';
import { useLanguage } from '@/i18n/language-context';
import { productService } from '@/services';
import type { Product } from '@/services/product';
import { formatCurrencyKhr, formatCurrencyUsd } from '@/utils/currency';

interface Props {
  readonly onScanBarcode: (code: string) => void;
  readonly onSelectProduct: (product: Product) => void;
  readonly isSearching?: boolean;
}

export function PosScannerSearchInput({
  onScanBarcode,
  onSelectProduct,
  isSearching,
}: Props) {
  const { t } = useLanguage();
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clean = value.trim();
    const timer = setTimeout(async () => {
      if (clean.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await productService.getAll({ search: clean, limit: 5 });
        setSuggestions(res.data || []);
        setIsOpen(true);
      } catch {
        setSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = value.trim();
    if (!clean) return;
    onScanBarcode(clean);
    setValue('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className='relative w-full'>
      <form onSubmit={handleSubmit} className='relative flex items-center gap-2'>
        <div className='relative flex-1'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400'>
            <Barcode size={18} />
          </div>
          <input
            type='text'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            placeholder={t('pos.searchPlaceholder')}
            className='w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3 pl-10 pr-9 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-inner focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-indigo-500/10 transition'
          />
          {value && (
            <button
              type='button'
              onClick={() => {
                setValue('');
                setSuggestions([]);
              }}
              className='absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer'
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type='submit'
          disabled={!value.trim() || isSearching}
          className='flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 active:scale-98 disabled:opacity-50 cursor-pointer transition shrink-0'
        >
          {isSearching ? <Loader2 size={16} className='animate-spin' /> : <Plus size={16} />}
          <span>Enter ↵</span>
        </button>
      </form>

      {/* Live search suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className='absolute z-50 left-0 right-0 mt-1.5 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl space-y-1 animate-in fade-in zoom-in-98 duration-150'>
          {suggestions.map((p) => (
            <button
              key={p.id}
              type='button'
              onClick={() => {
                onSelectProduct(p);
                setValue('');
                setIsOpen(false);
              }}
              className='w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer text-left'
            >
              <div className='min-w-0 flex-1 pr-3'>
                <p className='text-xs font-bold text-slate-900 truncate'>{p.name}</p>
                <p className='text-[10px] font-mono text-slate-400'>{p.barcode || p.id}</p>
              </div>
              <div className='text-right shrink-0'>
                <p className='text-xs font-extrabold text-emerald-600'>
                  {formatCurrencyUsd(p.sellPrice)}
                </p>
                <p className='text-[10px] font-medium text-slate-400'>
                  {formatCurrencyKhr(p.sellPrice)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
