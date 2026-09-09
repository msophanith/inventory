import type { Product } from '../../../services/product';
import { useLanguage } from '../../../i18n/language-context';

interface Props {
  readonly product: Product;
}

export function StockBadge({ product }: Props) {
  const qty = product.quantity ?? 0;
  const { t } = useLanguage();

  if (qty <= 0) {
    return (
      <span className='inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[10px] font-black text-rose-700'>
        <span className='h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse' />
        {t('products.outOfStock')}
      </span>
    );
  }
  return (
    <span className='inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-black text-amber-800'>
      <span className='h-1.5 w-1.5 rounded-full bg-amber-500' />
      {qty} {t('products.lowStock')}
    </span>
  );
}
