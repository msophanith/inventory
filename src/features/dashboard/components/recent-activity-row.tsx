import {
  ArrowDownCircle,
  ArrowUpCircle,
  RotateCcw,
} from 'lucide-react';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';
import { formatDateTime } from '../../../utils/date';
import { useLanguage } from '../../../i18n/language-context';
import type { Movement } from '../../../services/movement';

interface Props {
  readonly movement: Movement;
}

function getMovementStyle(type: string) {
  if (type === 'IN') {
    return {
      style: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
      Icon: ArrowDownCircle,
    };
  }
  if (type === 'OUT') {
    return {
      style: 'bg-rose-50 text-rose-700 border border-rose-200/60',
      Icon: ArrowUpCircle,
    };
  }
  return {
    style: 'bg-yellow-50 text-yellow-800 border border-yellow-200/60',
    Icon: RotateCcw,
  };
}

export function RecentActivityRow({ movement }: Props) {
  const { t } = useLanguage();
  const totalPrice =
    (movement.quantity || 0) *
    (movement.unitPrice || movement.product?.sellPrice || 0);
  const { style, Icon } = getMovementStyle(movement.type);

  return (
    <div className='flex items-center justify-between p-2.5 rounded-2xl transition hover:bg-slate-50/80'>
      <div className='flex items-center gap-3 min-w-0 pr-3'>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold shadow-2xs ${style}`}
        >
          <Icon size={18} />
        </div>
        <div className='min-w-0'>
          <div className='flex items-center gap-2'>
            <span className='font-bold text-xs text-slate-900 truncate'>
              {movement.product?.name || t('reports.stockMovement')}
            </span>
            <span className='rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase text-slate-600 shrink-0'>
              {movement.type === 'IN'
                ? t('movement.in')
                : movement.type === 'OUT'
                  ? t('movement.out')
                  : t('movement.adjustment')}{' '}
              ({Math.abs(movement.quantity)})
            </span>
          </div>
          <p className='text-[10px] font-medium text-slate-400 mt-0.5'>
            {formatDateTime(movement.createdAt, 'dd MMM, HH:mm')} •{' '}
            {movement.reference || t('reports.posTerminal')}
          </p>
        </div>
      </div>

      <div className='text-right shrink-0'>
        <span className='block text-xs font-black text-slate-900'>
          {formatCurrencyUsd(totalPrice)}
        </span>
        <span className='block text-[10px] font-extrabold text-indigo-600'>
          {formatCurrencyKhr(totalPrice)}
        </span>
      </div>
    </div>
  );
}
