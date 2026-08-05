import {
  ArrowUpRight,
  Activity,
  ArrowDownLeft,
  ArrowUpRight as ArrowUpRightIcon,
  RotateCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Movement } from '../../../services/movement';
import { formatDateTime } from '../../../utils/date';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';

interface Props {
  readonly movements?: Movement[];
  readonly isLoading?: boolean;
}

function getMovementBadge(type: string) {
  if (type === 'IN') {
    return {
      style: 'bg-emerald-100 text-emerald-700',
      Icon: ArrowDownLeft,
    };
  }
  if (type === 'OUT') {
    return {
      style: 'bg-blue-100 text-blue-700',
      Icon: ArrowUpRightIcon,
    };
  }
  return {
    style: 'bg-amber-100 text-amber-800',
    Icon: RotateCcw,
  };
}

export function DashboardRecentActivity({
  movements = [],
  isLoading = false,
}: Props) {
  const recentMovements = movements.slice(0, 6);

  let content;
  if (isLoading) {
    content = (
      <div className='space-y-3'>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className='h-12 animate-pulse rounded-2xl bg-slate-100'
          />
        ))}
      </div>
    );
  } else if (recentMovements.length === 0) {
    content = (
      <p className='p-6 text-center text-xs text-slate-400 font-semibold'>
        No recent movement logged.
      </p>
    );
  } else {
    content = (
      <div className='divide-y divide-slate-100'>
        {recentMovements.map((m) => {
          const totalPrice =
            (m.quantity || 0) * (m.unitPrice || m.product?.sellPrice || 0);
          const { style, Icon } = getMovementBadge(m.type);

          return (
            <div
              key={m.id}
              className='flex items-center justify-between py-3 hover:bg-slate-50/60 px-2 rounded-2xl transition'
            >
              <div className='flex items-center gap-3'>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold ${style}`}
                >
                  <Icon size={16} />
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <span className='font-bold text-xs text-slate-900'>
                      {m.product?.name || 'Stock Movement'}
                    </span>
                    <span className='text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase'>
                      {m.type} ({m.quantity})
                    </span>
                  </div>
                  <p className='text-[10px] font-mono text-slate-400 mt-0.5'>
                    {formatDateTime(m.createdAt, 'dd MMM, HH:mm')} •{' '}
                    {m.reference || 'POS Terminal'}
                  </p>
                </div>
              </div>

              <div className='text-right'>
                <span className='block text-xs font-black text-slate-900'>
                  {formatCurrencyUsd(totalPrice)}
                </span>
                <span className='block text-[10px] font-bold text-indigo-600'>
                  {formatCurrencyKhr(totalPrice)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className='rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-4'>
      <div className='flex items-center justify-between border-b border-slate-100 pb-3.5'>
        <div className='flex items-center gap-2.5'>
          <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-2xs'>
            <Activity size={20} />
          </div>
          <div>
            <h3 className='text-base font-extrabold text-slate-900'>
              Recent Stock Activity
            </h3>
            <p className='text-xs text-slate-500 font-medium'>
              Live store transaction audit log
            </p>
          </div>
        </div>
        <Link
          to='/reports'
          className='flex items-center gap-1 rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-extrabold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer'
        >
          <span>View All</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {content}
    </div>
  );
}
