import {
  ArrowDownCircle,
  ArrowUpCircle,
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
    subtitle: 'Add inventory from supplier',
    icon: ArrowDownCircle,
    color: 'from-emerald-500 via-emerald-600 to-teal-600',
  },

  OUT: {
    title: 'Stock Out',
    subtitle: 'Remove inventory or record damage',
    icon: ArrowUpCircle,
    color: 'from-red-500 via-rose-600 to-pink-600',
  },

  RETURN: {
    title: 'Customer Return',
    subtitle: 'Returned item goes back to stock',
    icon: RotateCcw,
    color: 'from-blue-500 via-indigo-600 to-purple-600',
  },
};

export default function StockMovementHeader({ type, product }: Props) {
  const item = config[type];
  const Icon = item.icon;

  return (
    <div
      className={`bg-gradient-to-br ${item.color} p-4 sm:p-6 text-white shadow-xs`}
    >
      <div className='flex items-center gap-3 sm:gap-4 pr-10'>
        <div className='flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-white/20 p-2.5 backdrop-blur-md shrink-0 shadow-inner'>
          <Icon className='h-5 w-5 sm:h-7 sm:w-7' />
        </div>

        <div className='min-w-0 flex-1'>
          <h2 className='text-lg sm:text-xl font-extrabold tracking-tight truncate'>
            {item.title}
          </h2>
          <p className='text-xs sm:text-sm text-white/80 font-medium truncate'>
            {item.subtitle}
          </p>
        </div>
      </div>

      {/* Target Product Pill */}
      <div className='mt-3 sm:mt-5 flex items-center gap-3 rounded-2xl bg-white/20 p-2.5 sm:p-3 backdrop-blur-md border border-white/10'>
        <Package size={20} className='shrink-0 text-white/90' />

        <div className='min-w-0 flex-1'>
          <p className='text-xs sm:text-sm font-bold text-white truncate'>
            {product.name}
          </p>

          <p className='text-[11px] sm:text-xs text-white/85 font-medium'>
            Current Stock: <span className='font-extrabold'>{product.quantity}</span> {product.unit || 'units'}
          </p>
        </div>
      </div>
    </div>
  );
}
