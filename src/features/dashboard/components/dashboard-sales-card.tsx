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
  readonly isHero?: boolean;
}

const THEME_MAP: Record<Theme, { icon: string }> = {
  emerald: {
    icon: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
  },
  blue: {
    icon: 'bg-blue-50 text-blue-600 border border-blue-200/60',
  },
  indigo: {
    icon: 'bg-indigo-50 text-indigo-600 border border-indigo-200/60',
  },
  teal: {
    icon: 'bg-teal-50 text-teal-600 border border-teal-200/60',
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
  isHero = false,
}: Props) {
  const styles = THEME_MAP[theme];

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-5 shadow-2xs transition-all duration-200 hover:shadow-xs hover:border-slate-300 ${
        isHero
          ? 'bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 text-white border-slate-800'
          : 'bg-white border-slate-200/80 text-slate-900'
      }`}
    >
      <div>
        <div className='flex items-center justify-between'>
          <span
            className={`text-xs font-bold tracking-tight ${
              isHero ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            {title}
          </span>
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-2xl shadow-2xs transition-transform duration-200 group-hover:scale-105 ${
              isHero
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : styles.icon
            }`}
          >
            <Icon size={17} />
          </div>
        </div>

        <div className='mt-2.5 space-y-1.5'>
          <div
            className={`text-2xl sm:text-3xl font-black tracking-tight tabular-nums ${
              isHero ? 'text-white' : 'text-slate-900'
            }`}
          >
            {mainValue}
          </div>
          {subBadge && <div className='flex items-center'>{subBadge}</div>}
        </div>
      </div>

      <div
        className={`mt-4 flex items-center justify-between border-t pt-3 text-xs font-medium ${
          isHero
            ? 'border-slate-800 text-slate-400'
            : 'border-slate-100 text-slate-500'
        }`}
      >
        {footerText && <span>{footerText}</span>}
        {action && <div className='ml-auto'>{action}</div>}
      </div>
    </div>
  );
}
