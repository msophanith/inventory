import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';

export type ReportCardTheme = 'emerald' | 'indigo' | 'rose';

interface Props {
  readonly title: string;
  readonly usdAmount: number;
  readonly khrAmount: number;
  readonly theme: ReportCardTheme;
  readonly icon: LucideIcon;
  readonly footerLeft: ReactNode;
  readonly footerRight?: ReactNode;
}

const THEME_MAP: Record<
  ReportCardTheme,
  {
    bg: string;
    border: string;
    iconBg: string;
    title: string;
    badge: string;
    footer: string;
    amount: string;
  }
> = {
  emerald: {
    bg: 'bg-linear-to-br from-emerald-50/90 via-emerald-50/40 to-white',
    border: 'border-emerald-200/80 hover:border-emerald-300',
    iconBg: 'bg-emerald-100/80 text-emerald-600 border border-emerald-200/80',
    title: 'text-emerald-800',
    badge: 'bg-emerald-100/90 text-emerald-800 border-emerald-200/80',
    footer: 'border-emerald-100/80 text-emerald-800',
    amount: 'text-slate-900',
  },
  indigo: {
    bg: 'bg-linear-to-br from-indigo-50/90 via-indigo-50/40 to-white',
    border: 'border-indigo-200/80 hover:border-indigo-300',
    iconBg: 'bg-indigo-100/80 text-indigo-600 border border-indigo-200/80',
    title: 'text-indigo-800',
    badge: 'bg-indigo-100/90 text-indigo-800 border-indigo-200/80',
    footer: 'border-indigo-100/80 text-indigo-700',
    amount: 'text-slate-900',
  },
  rose: {
    bg: 'bg-linear-to-br from-rose-50/90 via-orange-50/40 to-white',
    border: 'border-rose-200/80 hover:border-rose-300',
    iconBg: 'bg-rose-100/80 text-rose-600 border border-rose-200/80',
    title: 'text-rose-800',
    badge: 'bg-rose-100/90 text-rose-800 border-rose-200/80',
    footer: 'border-rose-100/80 text-rose-700',
    amount: 'text-rose-700',
  },
};

export function ReportSummaryCardItem({
  title,
  usdAmount,
  khrAmount,
  theme,
  icon: Icon,
  footerLeft,
  footerRight,
}: Props) {
  const styles = THEME_MAP[theme];

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${styles.bg} ${styles.border}`}
    >
      <div className='flex items-center justify-between'>
        <span
          className={`text-xs font-bold uppercase tracking-wider ${styles.title}`}
        >
          {title}
        </span>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-2xs border ${styles.iconBg}`}
        >
          <Icon size={20} />
        </div>
      </div>

      <div className='mt-3 space-y-1.5'>
        <h3
          className={`text-2xl sm:text-3xl font-black tracking-tight ${styles.amount}`}
        >
          {formatCurrencyUsd(usdAmount)}
        </h3>
        <span
          className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[11px] font-extrabold ${styles.badge}`}
        >
          {formatCurrencyKhr(khrAmount)}
        </span>
      </div>

      <div
        className={`mt-4 flex items-center justify-between border-t pt-3 text-xs font-semibold ${styles.footer}`}
      >
        <div className='truncate mr-2'>{footerLeft}</div>
        {footerRight && <div className='shrink-0'>{footerRight}</div>}
      </div>
    </div>
  );
}
