import { PackageCheck } from 'lucide-react';
import { useLanguage } from '@/i18n/language-context';
import type { CartItem } from '@/features/sell/types/sell.types';
import { formatCurrencyUsd } from '@/utils/currency';

interface Props {
  readonly items: CartItem[];
}

export function PosReceiptItemList({ items }: Props) {
  const { t } = useLanguage();

  return (
    <div className='rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs space-y-2.5 max-h-52 overflow-y-auto'>
      {items.map((i) => {
        const remainingStock = Math.max(0, i.product.quantity - i.quantity);
        const isLow = remainingStock <= (i.product.minStock || 2);

        return (
          <div
            key={i.product.id}
            className='flex flex-col gap-1 border-b border-slate-200/60 pb-2 last:border-0 last:pb-0'
          >
            <div className='flex justify-between font-bold text-slate-800'>
              <span>
                {i.quantity} {i.unit || i.product.unit || 'pcs'} of {i.product.name}
              </span>
              <span className='font-extrabold text-slate-900'>
                {formatCurrencyUsd(i.totalPrice)}
              </span>
            </div>
            <div className='flex items-center justify-between text-[11px] text-slate-500 font-medium'>
              <span className='flex items-center gap-1 text-slate-400'>
                <PackageCheck size={12} /> {t('pos.remainingStock')}:
              </span>
              <span
                className={`font-bold rounded-full px-2 py-0.5 text-[10px] ${
                  isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {remainingStock} {i.product.unit || 'units'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

