import type { Movement } from '../../../services/movement';
import { formatDateTime } from '../../../utils/date';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';
import MovementBadge from '../../movement/components/movement-badge';
import { useLanguage } from '../../../i18n/language-context';

interface Props {
  readonly item: Movement;
}

export function ProductMovementRow({ item }: Props) {
  const { t } = useLanguage();
  const isStockIn = item.type === 'IN';
  const displayPrice =
    item.unitPrice ??
    (isStockIn ? item.product?.buyPrice : item.product?.sellPrice) ??
    0;
  const isDamaged = Boolean(
    item.isDamaged || item.reference?.toLowerCase() === 'damage',
  );

  const isReturn = item.type === 'RETURN';
  const qtyPrefix = item.type === 'OUT' ? '-' : isReturn ? '' : '+';
  const qtyValue = item.quantity;

  return (
    <tr className='hover:bg-slate-50/70 transition-colors'>
      <td className='px-4 py-3'>
        <div className='flex items-center gap-1.5'>
          <MovementBadge type={item.type} />
          {isDamaged && (
            <span className='rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700'>
              {t('movement.damaged')}
            </span>
          )}
        </div>
      </td>
      <td className='px-4 py-3'>
        <span
          className={`font-bold text-sm ${
            isReturn
              ? 'text-amber-700'
              : item.type === 'OUT'
                ? 'text-slate-700'
                : 'text-emerald-700'
          }`}
        >
          {qtyPrefix}
          {qtyValue}
        </span>
        <span className='ml-1 text-[10px] text-slate-400 uppercase tracking-wider font-semibold'>
          {isReturn ? t('movement.return') : t('products.units')}
        </span>
      </td>
      <td className='px-4 py-3'>
        <p className='font-bold text-slate-800 text-xs sm:text-sm'>
          {formatCurrencyUsd(displayPrice)}
        </p>
        <p className='text-[10px] font-medium text-slate-400'>
          {formatCurrencyKhr(displayPrice)}
        </p>
      </td>
      <td className='px-4 py-3 text-slate-600 font-medium max-w-xs truncate text-xs'>
        {item.reference || item.note || '-'}
      </td>
      <td className='px-4 py-3 text-right text-slate-400 font-mono text-xs'>
        {formatDateTime(item.createdAt, 'MMM dd, yyyy HH:mm', '-')}
      </td>
    </tr>
  );
}
