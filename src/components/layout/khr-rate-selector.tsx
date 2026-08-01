import { useState, useRef, useEffect } from 'react';
import { Banknote, Check, Edit3, X } from 'lucide-react';
import { useCurrency } from '../../features/currency/context/currency-context';

export function KhrRateSelector() {
  const { khrRate, setKhrRate } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [prevKhrRate, setPrevKhrRate] = useState(khrRate);
  const [inputVal, setInputVal] = useState(khrRate.toString());
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (prevKhrRate !== khrRate) {
    setPrevKhrRate(khrRate);
    setInputVal(khrRate.toString());
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = (valStr: string) => {
    const parsed = Number.parseInt(valStr, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      setKhrRate(parsed);
      setIsOpen(false);
    }
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        type='button'
        onClick={() => setIsOpen((prev) => !prev)}
        title='Adjust KHR Exchange Rate'
        className='flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1.5 text-xs font-black text-indigo-700 hover:bg-indigo-100 transition cursor-pointer active:scale-95 shadow-2xs'
      >
        <Banknote size={14} className='text-indigo-600' />
        <span>$1 = ៛{new Intl.NumberFormat('en-US').format(khrRate)}</span>
        <Edit3 size={11} className='text-indigo-400 ml-0.5' />
      </button>

      {isOpen && (
        <div className='absolute right-0 top-11 z-50 w-72 rounded-3xl bg-white p-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 space-y-3'>
          <div className='flex items-center justify-between border-b border-slate-100 pb-2.5'>
            <div className='flex items-center gap-2'>
              <Banknote size={18} className='text-indigo-600' />
              <h4 className='font-extrabold text-slate-900 text-xs sm:text-sm'>
                KHR Exchange Rate
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className='rounded-lg p-1 text-slate-400 hover:bg-slate-100 transition'
            >
              <X size={16} />
            </button>
          </div>

          <div className='space-y-2'>
            <label className='block text-[11px] font-bold text-slate-500 uppercase tracking-wider'>
              Presets (1 USD to KHR)
            </label>
            <div className='grid grid-cols-4 gap-1.5'>
              {[4000, 4100, 4120, 4150].map((rate) => (
                <button
                  key={rate}
                  type='button'
                  onClick={() => handleSave(rate.toString())}
                  className={`rounded-xl py-1.5 text-xs font-black transition cursor-pointer ${
                    khrRate === rate
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {rate}
                </button>
              ))}
            </div>

            <div className='pt-1 space-y-1.5'>
              <label className='block text-[11px] font-bold text-slate-500 uppercase tracking-wider'>
                Custom Rate
              </label>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave(inputVal);
                }}
                className='flex gap-2'
              >
                <input
                  type='number'
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder='4100'
                  className='flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-extrabold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none'
                />
                <button
                  type='submit'
                  className='flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition cursor-pointer'
                >
                  <Check size={14} /> Save
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
