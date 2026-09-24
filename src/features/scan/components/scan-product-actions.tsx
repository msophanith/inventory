import { useNavigate } from 'react-router-dom';
import { ArrowRight, ExternalLink, RotateCcw, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';
import type { Product } from '../../../services/product.types';

interface Props {
  readonly product: Product;
  readonly isOutOfStock: boolean;
  readonly onAddToCart: (product: Product) => void;
  readonly onDismiss: () => void;
}

export function ScanProductActions({
  product,
  isOutOfStock,
  onAddToCart,
  onDismiss,
}: Props) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className='space-y-2 pt-1'>
      {/* Primary Action Button: Add to POS Cart */}
      <button
        type='button'
        disabled={isOutOfStock}
        onClick={() => onAddToCart(product)}
        className='group relative flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 px-4 text-xs sm:text-sm font-black text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-emerald-600/35 active:scale-[0.98] disabled:cursor-not-allowed disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 disabled:shadow-none cursor-pointer'
      >
        <ShoppingCart
          size={18}
          className='transition-transform duration-200 group-hover:scale-110'
        />
        <span>{isOutOfStock ? t('scan.outOfStock') : t('scan.addToCart')}</span>
      </button>

      {/* Secondary Action Row: Harmonized Pill Toolbar */}
      <div className='grid grid-cols-3 gap-2'>
        <button
          type='button'
          onClick={() => navigate('/movement')}
          className='flex h-10 items-center justify-center gap-1.5 rounded-2xl border border-slate-200/80 bg-slate-50 px-2 text-xs font-bold text-slate-700 shadow-2xs transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 active:scale-95 cursor-pointer'
        >
          <ArrowRight size={14} className='text-slate-500 shrink-0' />
          <span className='truncate'>{t('scan.stockMovement')}</span>
        </button>

        <button
          type='button'
          onClick={() => navigate(`/products/${product.id}`)}
          className='flex h-10 items-center justify-center gap-1.5 rounded-2xl border border-slate-200/80 bg-slate-50 px-2 text-xs font-bold text-slate-700 shadow-2xs transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 active:scale-95 cursor-pointer'
        >
          <ExternalLink size={14} className='text-slate-500 shrink-0' />
          <span className='truncate'>{t('scan.details')}</span>
        </button>

        <button
          type='button'
          onClick={onDismiss}
          className='flex h-10 items-center justify-center gap-1.5 rounded-2xl border border-slate-200/80 bg-slate-50 px-2 text-xs font-bold text-slate-700 shadow-2xs transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 active:scale-95 cursor-pointer'
        >
          <RotateCcw size={14} className='text-slate-500 shrink-0' />
          <span className='truncate'>{t('scan.scanNext')}</span>
        </button>
      </div>
    </div>
  );
}
