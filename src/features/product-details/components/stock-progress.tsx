import { AlertOctagon, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';

interface Props {
  readonly quantity: number;
  readonly minStock: number;
  readonly unit?: string;
}

const StockProgress = ({ quantity, minStock, unit = 'pcs' }: Props) => {
  const { t } = useLanguage();
  const targetStock = Math.max(minStock * 5, 10);
  const percentage = Math.min((quantity / targetStock) * 100, 100);
  const isLow = quantity <= minStock;
  
  const colorClasses = {
    bg: isLow ? 'bg-rose-500' : 'bg-linear-to-r from-emerald-500 to-teal-400',
    text: isLow ? 'text-rose-600' : 'text-emerald-600'
  };

  return (
    <div className='rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-4 min-w-0 w-full'>
      <div className='flex items-center justify-between'>
        <h2 className='font-bold text-slate-900 text-base flex items-center gap-2'>
          {t('products.stockLevel')}
          {isLow ? (
            <span className='flex items-center gap-1 text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold'>
              <AlertOctagon size={10} /> {t('products.lowStock')}
            </span>
          ) : (
            <span className='flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold'>
              <CheckCircle2 size={10} /> {t('products.healthy')}
            </span>
          )}
        </h2>
      </div>

      <div className='h-3.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 border border-slate-200/60'>
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClasses.bg}`}
          style={{ width: `${Math.max(percentage, 3)}%` }}
        />
      </div>

      <div className='flex items-baseline gap-1'>
        <span className={`text-2xl font-black tracking-tight ${colorClasses.text}`}>
          {quantity}
        </span>
        <span className='text-sm font-semibold text-slate-500'>{unit}</span>
      </div>
      <p className='text-xs font-semibold text-slate-400'>
        {t('products.minStock')}: {minStock} {unit}
      </p>
    </div>
  );
};

export default StockProgress;
