import {
  ArrowDownCircle,
  ArrowUpCircle,
  Barcode,
  Package,
  RotateCcw,
} from 'lucide-react';
import type { MovementType } from '../../../services/movement';
import type { Product } from '../../../services/product';

interface Props {
  readonly type: MovementType;
  readonly product: Product;
}

const config = {
  IN: {
    title: 'Stock In',
    subtitle: 'Receive & record incoming inventory',
    icon: ArrowDownCircle,
    color: 'from-emerald-600 via-teal-600 to-emerald-700',
    badgeBg: 'bg-emerald-400/20 text-emerald-100 border-emerald-300/30',
  },
  OUT: {
    title: 'Stock Out',
    subtitle: 'Issue stock or mark damaged items',
    icon: ArrowUpCircle,
    color: 'from-rose-600 via-red-600 to-pink-700',
    badgeBg: 'bg-rose-400/20 text-rose-100 border-rose-300/30',
  },
  RETURN: {
    title: 'Customer Return',
    subtitle: 'Process return item back to catalog',
    icon: RotateCcw,
    color: 'from-indigo-600 via-violet-600 to-purple-700',
    badgeBg: 'bg-indigo-400/20 text-indigo-100 border-indigo-300/30',
  },
};

export default function StockMovementHeader({ type, product }: Props) {
  const item = config[type];
  const Icon = item.icon;

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${item.color} p-5 sm:p-6 text-white shadow-md`}>
      {/* Decorative ambient background blur circle */}
      <div className='pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl' />

      <div className='relative flex items-center gap-3 sm:gap-4 pr-10'>
        <div className='flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-white/20 p-2.5 backdrop-blur-xl border border-white/25 shrink-0 shadow-lg shadow-black/10'>
          <Icon className='h-6 w-6 sm:h-7 sm:w-7 text-white' />
        </div>

        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2'>
            <h2 className='text-lg sm:text-xl font-black tracking-tight text-white truncate'>
              {item.title}
            </h2>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border backdrop-blur-md ${item.badgeBg}`}>
              {type}
            </span>
          </div>
          <p className='text-xs sm:text-sm text-white/80 font-medium truncate mt-0.5'>
            {item.subtitle}
          </p>
        </div>
      </div>

      {/* Target Product Glass Card */}
      <div className='relative mt-4 sm:mt-5 flex items-center gap-3 rounded-2xl bg-white/15 p-3 sm:p-3.5 backdrop-blur-xl border border-white/25 shadow-inner'>
        <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white shrink-0 border border-white/20'>
          <Package size={18} />
        </div>

        <div className='min-w-0 flex-1'>
          <div className='flex items-center justify-between gap-2'>
            <p className='text-xs sm:text-sm font-bold text-white truncate leading-tight'>
              {product.name}
            </p>
            {product.barcode && (
              <span className='hidden sm:flex items-center gap-1 text-[10px] font-semibold text-white/75 bg-black/20 px-2 py-0.5 rounded-md border border-white/10 shrink-0'>
                <Barcode size={12} /> {product.barcode}
              </span>
            )}
          </div>

          <div className='mt-1 flex items-center gap-2 text-[11px] sm:text-xs text-white/90 font-medium'>
            <span>Current Stock:</span>
            <span className='font-black bg-white/20 px-2 py-0.5 rounded-lg border border-white/20 text-white'>
              {product.quantity} {product.unit || 'units'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
