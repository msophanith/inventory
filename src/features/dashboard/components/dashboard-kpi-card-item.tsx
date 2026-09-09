import type { LucideIcon } from 'lucide-react';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';

export type KpiTheme = 'emerald' | 'blue' | 'indigo' | 'rose';

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
  {
    bg: string;
    border: string;
    iconBg: string;
    khrBadge: string;
    glow: string;
  }
> = {
  emerald: {
    bg: 'bg-linear-to-br from-emerald-50/90 via-emerald-50/40 to-white',
    border: 'border-emerald-200/80 hover:border-emerald-300',
    iconBg: 'bg-emerald-100/80 text-emerald-600 border border-emerald-200/80',
    khrBadge: 'bg-emerald-100/90 text-emerald-800 border border-emerald-200/80',
    glow: 'from-emerald-500/10 to-transparent',
  },
  blue: {
    bg: 'bg-linear-to-br from-blue-50/90 via-blue-50/40 to-white',
    border: 'border-blue-200/80 hover:border-blue-300',
    iconBg: 'bg-blue-100/80 text-blue-600 border border-blue-200/80',
    khrBadge: 'bg-blue-100/90 text-blue-800 border border-blue-200/80',
    glow: 'from-blue-500/10 to-transparent',
  },
  indigo: {
    bg: 'bg-linear-to-br from-indigo-50/90 via-indigo-50/40 to-white',
    border: 'border-indigo-200/80 hover:border-indigo-300',
    iconBg: 'bg-indigo-100/80 text-indigo-600 border border-indigo-200/80',
    khrBadge: 'bg-indigo-100/90 text-indigo-800 border border-indigo-200/80',
    glow: 'from-indigo-500/10 to-transparent',
  },
  rose: {
    bg: 'bg-linear-to-br from-rose-50/90 via-rose-50/40 to-white',
    border: 'border-rose-200/80 hover:border-rose-300',
    iconBg: 'bg-rose-100/80 text-rose-600 border border-rose-200/80',
    khrBadge: 'bg-rose-100/90 text-rose-800 border border-rose-200/80',
    glow: 'from-rose-500/10 to-transparent',
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
    <div
      className={`group relative overflow-hidden rounded-3xl border ${styles.bg} p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${styles.border}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${styles.glow} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div className='relative flex items-center justify-between'>
        <span className='text-xs font-bold uppercase tracking-wider text-slate-500'>
          {title}
        </span>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-2xs transition-transform duration-300 group-hover:scale-105 ${styles.iconBg}`}
        >
          <Icon size={20} />
        </div>
      </div>

      <div className='relative mt-3 space-y-1.5'>
        {usdAmount !== undefined ? (
          <div>
            <h3 className='text-2xl sm:text-3xl font-black tracking-tight text-slate-900'>
              {formatCurrencyUsd(usdAmount)}
            </h3>
            {khrAmount !== undefined && (
              <div className='mt-1.5 flex items-center'>
                <span
                  className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-extrabold tracking-tight ${styles.khrBadge}`}
                >
                  {formatCurrencyKhr(khrAmount)}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className='text-2xl sm:text-3xl font-black tracking-tight text-slate-900'>
              {count}{' '}
              {countSuffix && (
                <span className='text-sm font-semibold text-slate-400'>
                  {countSuffix}
                </span>
              )}
            </h3>
          </div>
        )}
      </div>

      <div className='relative mt-4 flex items-center justify-between border-t border-slate-200/50 pt-3 text-xs font-semibold'>
        <div className='text-slate-500 truncate mr-2'>{subText}</div>
        {statusBadge && (
          <span className='shrink-0 rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 border border-slate-200/50'>
            {statusBadge}
          </span>
        )}
        {action && (
          <button
            type='button'
            onClick={action.onClick}
            className='shrink-0 cursor-pointer text-xs font-extrabold text-indigo-600 hover:text-indigo-800 transition active:scale-95'
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
