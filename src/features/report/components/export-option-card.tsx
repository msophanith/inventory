import type { ReactNode } from 'react';
import { ArrowRight, Download, Sparkles } from 'lucide-react';
import type { ExportType } from './report-export-modals';

export interface ExportOptionItem {
  id: ExportType;
  title: string;
  description: string;
  icon: ReactNode;
  format: '.xlsx' | '.csv';
  theme: {
    cardBg: string;
    border: string;
    hoverBorder: string;
    glow: string;
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    badgeText: string;
  };
  isFeatured?: boolean;
}

interface Props {
  readonly option: ExportOptionItem;
  readonly onSelect: (id: ExportType) => void;
}

export function ExportOptionCard({ option, onSelect }: Props) {
  const { id, title, description, icon, format, theme, isFeatured } = option;

  if (isFeatured) {
    return (
      <button
        type='button'
        onClick={() => onSelect(id)}
        className={`group relative col-span-full overflow-hidden rounded-3xl border p-5 sm:p-6 text-left shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer ${theme.border} ${theme.cardBg} ${theme.hoverBorder}`}
      >
        <div
          className={`pointer-events-none absolute -right-8 -bottom-8 h-40 w-40 rounded-full ${theme.glow} blur-2xl`}
        />

        <div className='relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div className='flex items-start gap-4'>
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${theme.iconBg} ${theme.iconColor}`}
            >
              {icon}
            </div>

            <div className='space-y-1.5'>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-2xs'>
                  <Sparkles size={11} /> Master Report
                </span>
                <span
                  className={`rounded-lg px-2 py-0.5 font-mono text-[11px] font-extrabold shadow-2xs ${theme.badgeBg} ${theme.badgeText}`}
                >
                  {format}
                </span>
              </div>
              <h3 className='text-lg font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors'>
                {title}
              </h3>
              <p className='text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-xl'>
                {description}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2 self-end sm:self-center shrink-0 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/20 transition-all duration-200 group-hover:bg-emerald-700 group-hover:shadow-lg active:scale-95'>
            <Download size={15} className='transition-transform group-hover:translate-y-0.5' />
            <span>Generate Excel</span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      type='button'
      onClick={() => onSelect(id)}
      className={`group relative overflow-hidden rounded-3xl border p-5 text-left shadow-xs transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer flex flex-col justify-between ${theme.border} ${theme.cardBg} ${theme.hoverBorder}`}
    >
      <div
        className={`pointer-events-none absolute -right-6 -bottom-6 h-32 w-32 rounded-full ${theme.glow} blur-2xl`}
      />

      <div className='relative z-10 space-y-3'>
        <div className='flex items-center justify-between'>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${theme.iconBg} ${theme.iconColor}`}
          >
            {icon}
          </div>
          <span
            className={`rounded-lg px-2 py-0.5 font-mono text-[10px] font-extrabold shadow-2xs ${theme.badgeBg} ${theme.badgeText}`}
          >
            {format}
          </span>
        </div>

        <div>
          <h3 className='text-base font-black text-slate-900 tracking-tight group-hover:text-slate-800 transition-colors'>
            {title}
          </h3>
          <p className='mt-1 text-xs text-slate-500 font-medium leading-relaxed'>
            {description}
          </p>
        </div>
      </div>

      <div className='relative z-10 mt-4 flex items-center justify-between border-t border-slate-200/50 pt-3 text-xs font-bold text-slate-400 group-hover:text-slate-700 transition-colors'>
        <span>Export Report</span>
        <ArrowRight
          size={14}
          className='transition-transform duration-200 group-hover:translate-x-1 text-slate-400 group-hover:text-slate-900'
        />
      </div>
    </button>
  );
}
