import { AlertTriangle, DollarSign, Package, Percent, TrendingUp } from 'lucide-react';
import type { Product } from '../../../services/product';
import { calculateMargin } from '../../../utils/helper';

interface Props {
  readonly product: Product;
}

const ProductStats = ({ product }: Props) => {
  const margin = calculateMargin(product.buyPrice, product.sellPrice);

  const stats = [
    {
      title: 'Current Stock',
      value: `${product.quantity} ${product.unit}`,
      icon: Package,
      className: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Buy Price',
      value: `$${product.buyPrice.toFixed(2)}`,
      icon: DollarSign,
      className: 'bg-slate-100 text-slate-700',
    },
    {
      title: 'Sell Price',
      value: `$${product.sellPrice.toFixed(2)}`,
      icon: DollarSign,
      className: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Profit Margin',
      value: `${margin.toFixed(1)}%`,
      icon: Percent,
      className: margin >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600',
    },
    {
      title: 'Min Stock Alert',
      value: `${product.minStock} ${product.unit}`,
      icon: product.quantity <= product.minStock ? AlertTriangle : TrendingUp,
      className: product.quantity <= product.minStock ? 'bg-rose-50 text-rose-600' : 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 min-w-0 w-full'>
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className='rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs space-y-3 transition hover:-translate-y-0.5 hover:shadow-xs'
          >
            <div className='flex items-center justify-between'>
              <p className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                {item.title}
              </p>
              <div className={`flex h-9 w-9 items-center justify-center rounded-2xl ${item.className}`}>
                <Icon size={18} />
              </div>
            </div>
            <h3 className='text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight'>
              {item.value}
            </h3>
          </div>
        );
      })}
    </div>
  );
};

export default ProductStats;
