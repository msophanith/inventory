import type { LucideIcon } from 'lucide-react';
import { formatCurrencyKhr, formatCurrencyUsd } from '@/utils/currency';

export type KpiTheme = 'emerald' | 'blue' | 'indigo' | 'amber' | 'rose';

interface Props {
  readonly title: string;
  readonly usdAmount?: number;
  readonly khrAmount?: number;
  readonly count?: number;
  readonly countSuffix?: string;
  readonly subText?: string;
  readonly statusBadge?: string;
  readonly icon: LucideIcon;
  readonly theme: KpiTheme;
  readonly action?: { label: string; onClick: () => void };
}

const THEME_STYLES: Record<
  KpiTheme,
  { iconBg: string; khrBadge: string }
> = {
  emerald: {
    iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    khrBadge: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
  },
  blue: {
    iconBg: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    khrBadge: 'bg-blue-50 text-blue-800 border border-blue-200/80',
  },
  indigo: {
    iconBg: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
    khrBadge: 'bg-indigo-50 text-indigo-800 border border-indigo-200/80',
  },
  amber: {
    iconBg: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    khrBadge: 'bg-amber-50 text-amber-800 border border-amber-200/80',
  },
  rose: {
    iconBg: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    khrBadge: 'bg-rose-50 text-rose-800 border border-rose-200/80',
  },
};

export function DashboardKpiCardItem({
  title,
  usdAmount,
  khrAmount,
  count,
  countSuffix,
  subText,
  statusBadge,
  icon: Icon,
  theme,
  action,
}: Props) {
  const styles = THEME_STYLES[theme];

  return (
    <div className='group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all duration-200 hover:shadow-xs hover:border-slate-300'>
      <div>
        <div className='flex items-center justify-between'>
          <span className='text-xs font-bold text-slate-500 tracking-tight'>
            {title}
          </span>
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-2xl shadow-2xs transition-transform duration-200 group-hover:scale-105 ${styles.iconBg}`}
          >
            <Icon size={17} />
          </div>
        </div>

        <div className='mt-2.5 space-y-1.5'>
          {usdAmount !== undefined ? (
            <div>
              <div className='text-2xl sm:text-3xl font-black tracking-tight text-slate-900 tabular-nums'>
                {formatCurrencyUsd(usdAmount)}
              </div>
              {khrAmount !== undefined && (
                <div className='mt-1.5 flex items-center'>
                  <span
                    className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-bold ${styles.khrBadge}`}
                  >
                    {formatCurrencyKhr(khrAmount)}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className='text-2xl sm:text-3xl font-black tracking-tight text-slate-900 tabular-nums'>
              {count}{' '}
              {countSuffix && (
                <span className='text-sm font-semibold text-slate-400'>
                  {countSuffix}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className='mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs font-medium'>
        <div className='text-slate-500 text-xs'>{subText}</div>
        {statusBadge && (
          <span className='shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 border border-slate-200'>
            {statusBadge}
          </span>
        )}
        {action && (
          <button
            type='button'
            onClick={action.onClick}
            className='shrink-0 cursor-pointer text-xs font-bold text-indigo-600 hover:text-indigo-800 transition active:scale-95 hover:underline whitespace-nowrap'
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
