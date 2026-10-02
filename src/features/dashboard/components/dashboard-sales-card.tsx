import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type Theme = 'emerald' | 'blue' | 'indigo' | 'teal';

interface Props {
  readonly title: string;
  readonly mainValue: ReactNode;
  readonly subBadge?: ReactNode;
  readonly footerText?: string;
  readonly icon: LucideIcon;
  readonly theme: Theme;
  readonly action?: ReactNode;
}

const THEME_MAP: Record<
  Theme,
  { border: string; bg: string; iconBg: string; text: string }
> = {
  emerald: {
    border: 'border-emerald-200/80 hover:border-emerald-300',
    bg: 'bg-linear-to-br from-emerald-50/90 via-emerald-50/40 to-white',
    iconBg: 'bg-emerald-100/80 text-emerald-600 border border-emerald-200/80',
    text: 'text-emerald-800',
  },
  blue: {
    border: 'border-blue-200/80 hover:border-blue-300',
    bg: 'bg-linear-to-br from-blue-50/90 via-blue-50/40 to-white',
    iconBg: 'bg-blue-100/80 text-blue-600 border border-blue-200/80',
    text: 'text-blue-800',
  },
  indigo: {
    border: 'border-indigo-200/80 hover:border-indigo-300',
    bg: 'bg-linear-to-br from-indigo-50/90 via-indigo-50/40 to-white',
    iconBg: 'bg-indigo-100/80 text-indigo-600 border border-indigo-200/80',
    text: 'text-indigo-800',
  },
  teal: {
    border: 'border-teal-200/80 hover:border-teal-300',
    bg: 'bg-linear-to-br from-teal-50/90 via-teal-50/40 to-white',
    iconBg: 'bg-teal-100/80 text-teal-600 border border-teal-200/80',
    text: 'text-teal-800',
  },
};

export function DashboardSalesCard({
  title,
  mainValue,
  subBadge,
  footerText,
  icon: Icon,
  theme,
  action,
}: Props) {
  const styles = THEME_MAP[theme];

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border ${styles.border} ${styles.bg} p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between`}
    >
      <div>
        <div className='flex items-center justify-between'>
          <span className='text-xs font-bold uppercase tracking-wider text-slate-500'>
            {title}
          </span>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-2xs transition-transform duration-300 group-hover:scale-105 ${styles.iconBg}`}
          >
            <Icon size={18} />
          </div>
        </div>
        <div className='mt-2 space-y-1.5'>
          <h3 className='text-2xl sm:text-3xl font-black tracking-tight text-slate-900'>
            {mainValue}
          </h3>
          {subBadge && <div className='flex items-center'>{subBadge}</div>}
        </div>
      </div>

      <div className='mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs font-semibold'>
        {footerText && (
          <span className='text-slate-500 font-medium'>{footerText}</span>
        )}
        {action && <div className='ml-auto'>{action}</div>}
      </div>
    </div>
  );
}

