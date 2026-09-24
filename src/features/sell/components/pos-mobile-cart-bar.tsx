import { ChevronRight, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';

interface Props {
  readonly itemCount: number;
  readonly totalAmount: number;
  readonly onOpenCartDrawer: () => void;
  readonly onOpenScanModal?: () => void;
}

export function PosMobileCartBar({
  itemCount,
  totalAmount,
  onOpenCartDrawer,
}: Props) {
  const { t } = useLanguage();

  if (itemCount === 0) return null;

  return (
    <div className='lg:hidden fixed bottom-20 left-3 right-3 z-40 max-w-lg mx-auto animate-in slide-in-from-bottom-3 duration-200'>
      <button
        type='button'
        onClick={onOpenCartDrawer}
        className='w-full flex items-center justify-between gap-3 rounded-2xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 px-4 py-3 text-white shadow-2xl shadow-slate-900/30 active:scale-98 transition cursor-pointer border border-indigo-500/30'
      >
        <div className='flex items-center gap-3 min-w-0'>
          <div className='relative flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0 border border-indigo-500/30'>
            <ShoppingCart size={20} />
            <span className='absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white shadow-xs'>
              {itemCount}
            </span>
          </div>

          <div className='text-left min-w-0'>
            <p className='text-[10px] uppercase font-bold text-slate-300 tracking-wider'>
              {t('pos.cart')} ({itemCount})
            </p>
            <p className='text-sm font-black truncate text-white'>
              {formatCurrencyUsd(totalAmount)}{' '}
              <span className='text-xs font-bold text-indigo-300'>
                ({formatCurrencyKhr(totalAmount)})
              </span>
            </p>
          </div>
        </div>

        <div className='flex items-center gap-1 text-xs font-black bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 rounded-xl shrink-0 shadow-md transition'>
          <span>{t('pos.checkout')}</span>
          <ChevronRight size={16} />
        </div>
      </button>
    </div>
  );
}
