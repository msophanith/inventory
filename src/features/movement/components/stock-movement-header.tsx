import {
  ArrowDownCircle,
  ArrowUpCircle,
  Barcode,
  Package,
  RotateCcw,
  X,
} from 'lucide-react';
import type { MovementType } from '../../../services/movement';
import type { Product } from '../../../services/product';

interface Props {
  readonly type: MovementType;
  readonly product: Product;
  readonly onClose?: () => void;
}

const TYPE_CONFIG = {
  IN: {
    title: 'Stock In',
    badge: 'Receiving',
    icon: ArrowDownCircle,
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
    accentBorder: 'border-t-4 border-t-emerald-600',
    iconColor: 'text-emerald-600 bg-emerald-100',
  },
  OUT: {
    title: 'Stock Out',
    badge: 'Deducting',
    icon: ArrowUpCircle,
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
    accentBorder: 'border-t-4 border-t-rose-600',
    iconColor: 'text-rose-600 bg-rose-100',
  },
  RETURN: {
    title: 'Customer Return',
    badge: 'Return',
    icon: RotateCcw,
    badgeClass: 'bg-violet-50 text-violet-700 border-violet-200 ring-violet-500/20',
    accentBorder: 'border-t-4 border-t-violet-600',
    iconColor: 'text-violet-600 bg-violet-100',
  },
};

export default function StockMovementHeader({ type, product, onClose }: Props) {
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;
  const isOutOfStock = product.quantity <= 0;
  const isLowStock = product.minStock > 0 && product.quantity <= product.minStock;

  return (
    <div className={`relative bg-white px-4 py-3.5 sm:px-5 sm:py-4 border-b border-slate-100 shadow-2xs ${config.accentBorder}`}>
      <div className='flex items-start justify-between gap-3 pr-8'>
        <div className='flex items-center gap-3 min-w-0'>
          {/* Movement Type Icon */}
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconColor} shadow-2xs`}>
            <Icon size={20} />
          </div>

          <div className='min-w-0 flex-1'>
            {/* Type badge + Product Title */}
            <div className='flex items-center gap-2 flex-wrap'>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ring-1 ${config.badgeClass}`}>
                {config.title}
              </span>
              <h2 className='text-sm sm:text-base font-bold text-slate-900 truncate leading-snug' title={product.name}>
                {product.name}
              </h2>
            </div>

            {/* Sub-info: Barcode & Current Stock */}
            <div className='mt-1 flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap'>
              {product.barcode && (
                <span className='inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200'>
                  <Barcode size={11} /> {product.barcode}
                </span>
              )}
              <span className='inline-flex items-center gap-1 text-[11px] text-slate-600'>
                <Package size={12} className='text-slate-400' />
                Current Stock:
                <span
                  className={`font-black px-1.5 py-0.2 rounded text-[11px] ${
                    isOutOfStock
                      ? 'bg-rose-100 text-rose-700'
                      : isLowStock
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {product.quantity} {product.unit || 'pcs'}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            type='button'
            onClick={onClose}
            aria-label='Close modal'
            className='absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-all cursor-pointer active:scale-90'
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
