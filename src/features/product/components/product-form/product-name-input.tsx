import { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { type Product } from '../../../../services/product';
import { productService } from '../../../../services';

interface Props {
  readonly register: any;
  readonly setValue?: any;
  readonly error?: string;
  readonly watchName?: string;
}

export function ProductNameInput({
  register,
  setValue,
  error,
  watchName,
}: Props) {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!watchName || watchName.trim().length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      try {
        const res = await productService.getAll({
          search: watchName.trim(),
          limit: 6,
        });
        const matches = res.data || [];
        setSuggestions(matches);
        setIsOpen(matches.length > 0);
      } catch (err) {
        console.error('Error fetching product name suggestions:', err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [watchName]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (product: Product) => {
    if (setValue) {
      setValue('name', product.name, {
        shouldValidate: true,
        shouldDirty: true,
      });
      if (product.category)
        setValue('category', product.category, { shouldDirty: true });
      if (product.unit) setValue('unit', product.unit, { shouldDirty: true });
      if (product.sellPrice)
        setValue('sellPrice', product.sellPrice, { shouldDirty: true });
      if (product.buyPrice)
        setValue('buyPrice', product.buyPrice, { shouldDirty: true });
    }
    setIsOpen(false);
  };

  return (
    <div className='relative space-y-1.5' ref={containerRef}>
      <label className='block text-xs font-bold uppercase tracking-wider text-slate-600'>
        Product Name <span className='text-rose-500'>*</span>
      </label>
      <div className='relative'>
        <input
          {...register('name')}
          type='text'
          placeholder='e.g., Engine Oil 5W-30'
          autoComplete='off'
          className={`w-full rounded-2xl border bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition focus:outline-none focus:ring-2 ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
          }`}
        />
        {isOpen && (
          <Sparkles
            size={14}
            className='absolute right-3.5 top-1/2 -translate-y-1/2 text-indigo-500 animate-pulse pointer-events-none'
          />
        )}
      </div>

      {error && <p className='text-xs font-semibold text-rose-500'>{error}</p>}

      {/* Auto-Suggestion Floating Menu */}
      {isOpen && suggestions.length > 0 && (
        <div className='absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in duration-150'>
          <p className='px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400'>
            Existing Products Auto-Suggestions:
          </p>
          {suggestions.map((p) => (
            <button
              key={p.id}
              type='button'
              onClick={() => handleSelectSuggestion(p)}
              className='flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition hover:bg-indigo-50/80 cursor-pointer'
            >
              <div>
                <p className='font-bold text-slate-900'>{p.name}</p>
                <p className='text-[10px] text-slate-400'>
                  {p.category || 'General'} • {p.barcode || 'No barcode'}
                </p>
              </div>
              <span className='rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-black text-indigo-700'>
                Auto-fill
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
