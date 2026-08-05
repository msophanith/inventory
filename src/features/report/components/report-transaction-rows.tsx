import type { Movement } from '../../../services/movement';
import { calculateMovementItem } from '../utils/report-calculator';
import { formatDateTime } from '../../../utils/date';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';

interface Props {
  readonly data: Movement[];
  readonly loading?: boolean;
}

export function ReportTransactionRows({ data, loading }: Props) {
  if (loading) {
    return (
      <tr>
        <td colSpan={6} className='p-10 text-center text-slate-400'>
          Loading transactions...
        </td>
      </tr>
    );
  }

  if (data.length === 0) {
    return (
      <tr>
        <td colSpan={6} className='p-12 text-center text-slate-500'>
          No transaction logs found for this period.
        </td>
      </tr>
    );
  }

  return data.map((rawItem) => {
    const calc = calculateMovementItem(rawItem);
    const isDamaged = Boolean(
      rawItem.isDamaged || rawItem.reference?.toLowerCase() === 'damage',
    );
    const dateFormatted = formatDateTime(rawItem.createdAt);

    const typeBadgeClass =
      rawItem.type === 'OUT'
        ? 'bg-orange-100 text-orange-700'
        : rawItem.type === 'RETURN'
          ? 'bg-purple-100 text-purple-700'
          : 'bg-blue-100 text-blue-700';

    const unitPrice = rawItem.unitPrice ?? rawItem.product?.sellPrice ?? 0;
    const buyPrice = rawItem.product?.buyPrice ?? 0;

    return (
      <tr key={rawItem.id} className='transition hover:bg-slate-50/70'>
        {/* Date & ID */}
        <td className='px-6 py-4'>
          <p className='font-semibold text-slate-800'>{dateFormatted}</p>
          <p className='text-xs text-slate-400 font-mono'>
            #{rawItem.id.slice(0, 8)}
          </p>
        </td>

        {/* Product */}
        <td className='px-6 py-4'>
          <p className='font-bold text-slate-900'>
            {rawItem.product?.name || rawItem.productId}
          </p>
          <p className='text-xs text-slate-500'>
            Buy: {formatCurrencyUsd(buyPrice)} | Sell: {formatCurrencyUsd(unitPrice)}
          </p>
        </td>

        {/* Type & Condition */}
        <td className='px-6 py-4'>
          <div className='flex items-center gap-2'>
            <span
              className={`rounded-xl px-2.5 py-1 text-xs font-bold ${typeBadgeClass}`}
            >
              {rawItem.type}
            </span>
            {isDamaged ? (
              <span className='rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700'>
                Damaged
              </span>
            ) : (
              <span className='rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700'>
                Good
              </span>
            )}
          </div>
        </td>

        {/* Quantity */}
        <td className='px-6 py-4 text-center font-bold text-slate-800'>
          {rawItem.quantity}
        </td>

        {/* Effective Sale */}
        <td className='px-6 py-4 text-right'>
          <span
            className={`block font-bold ${calc.effectiveSaleAmount < 0 ? 'text-rose-600' : 'text-slate-900'}`}
          >
            {formatCurrencyUsd(calc.effectiveSaleAmount)}
          </span>
          <span className='block text-[10px] font-bold text-indigo-600'>
            {formatCurrencyKhr(calc.effectiveSaleAmount)}
          </span>
        </td>

        {/* Effective Margin */}
        <td className='px-6 py-4 text-right'>
          <span
            className={`block font-bold ${calc.effectiveMarginAmount < 0 ? 'text-rose-600' : 'text-emerald-600'}`}
          >
            {formatCurrencyUsd(calc.effectiveMarginAmount)}
          </span>
          <span className='block text-[10px] font-medium text-slate-500'>
            {formatCurrencyKhr(calc.effectiveMarginAmount)}
          </span>
        </td>
      </tr>
    );
  });
}
