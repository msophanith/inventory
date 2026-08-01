import type { Product } from '../../../services/product';
import { LowStockCard } from './low-stock-card';
import { OutOfStockCard } from './out-of-stock-card';

interface Props {
  readonly outOfStockProducts: Product[];
  readonly lowStockProducts: Product[];
  readonly isLoading?: boolean;
}

export function StockAlertSection({
  outOfStockProducts = [],
  lowStockProducts = [],
  isLoading = false,
}: Props) {
  if (isLoading) {
    return (
      <div className='grid gap-6 lg:grid-cols-2'>
        <div className='h-80 animate-pulse rounded-3xl border border-slate-200/80 bg-slate-100/60 p-6' />
        <div className='h-80 animate-pulse rounded-3xl border border-slate-200/80 bg-slate-100/60 p-6' />
      </div>
    );
  }

  return (
    <div className='grid gap-6 lg:grid-cols-2'>
      <OutOfStockCard products={outOfStockProducts} />
      <LowStockCard products={lowStockProducts} />
    </div>
  );
}
