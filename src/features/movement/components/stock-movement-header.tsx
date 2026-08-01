import {
  ArrowDownCircle,
  ArrowUpCircle,
  RotateCcw,
  Package,
} from 'lucide-react';
import type { MovementType } from '../../../services/movement';
import type { Product } from '../../../services/product';

interface Props {
  type: MovementType;
  product: Product;
}

const config = {
  IN: {
    title: 'Stock In',
    subtitle: 'Add inventory from supplier',
    icon: ArrowDownCircle,
    color: 'from-emerald-500 to-green-600',
  },

  OUT: {
    title: 'Stock Out',
    subtitle: 'Remove inventory from stock',
    icon: ArrowUpCircle,
    color: 'from-red-500 to-rose-600',
  },

  RETURN: {
    title: 'Customer Return',
    subtitle: 'Returned item goes back to stock',
    icon: RotateCcw,
    color: 'from-blue-500 to-indigo-600',
  },
};

export default function StockMovementHeader({ type, product }: Props) {
  const item = config[type];

  const Icon = item.icon;

  return (
    <div
      className={`
        bg-linear-to-br
        ${item.color}
        p-6
        text-white
      `}
    >
      <div className='flex items-center gap-4'>
        <div
          className='
            rounded-2xl
            bg-white/20
            p-3
          '
        >
          <Icon size={32} />
        </div>

        <div>
          <h2 className='text-xl font-bold'>{item.title}</h2>

          <p className='text-sm text-white/80'>{item.subtitle}</p>
        </div>
      </div>

      <div
        className='
          mt-5
          flex
          items-center
          gap-3
          rounded-2xl
          bg-white/20
          p-3
        '
      >
        <Package size={22} />

        <div>
          <p className='font-semibold'>{product.name}</p>

          <p className='text-sm text-white/80'>
            Current: {product.quantity} {product.unit}
          </p>
        </div>
      </div>
    </div>
  );
}
