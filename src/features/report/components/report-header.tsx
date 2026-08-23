import { Calendar, CalendarRange, Download, FileSpreadsheet, RefreshCw } from 'lucide-react';
import type { MonthOption } from '../types/report.types';
import type { DateMode } from '../hooks/use-report';
import { useLanguage } from '../../../i18n/language-context';

interface Props {
  readonly selectedMonth: string;
  readonly onSelectMonth: (month: string) => void;
  readonly monthOptions: MonthOption[];
  readonly onOpenExportCenter: () => void;
  readonly onRefresh: () => void;
  readonly isRefreshing?: boolean;
  readonly dateMode: DateMode;
  readonly onDateModeChange: (mode: DateMode) => void;
  readonly customStart: string;
  readonly customEnd: string;
  readonly onCustomStartChange: (v: string) => void;
  readonly onCustomEndChange: (v: string) => void;
}

export function ReportHeader({
  selectedMonth,
  onSelectMonth,
  monthOptions,
  onOpenExportCenter,
  onRefresh,
  isRefreshing,
  dateMode,
  onDateModeChange,
  customStart,
  customEnd,
  onCustomStartChange,
  onCustomEndChange,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className='flex flex-col gap-5 md:flex-row md:items-center md:justify-between rounded-3xl border border-slate-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-md transition-all hover:border-slate-300'>
      {/* Title & Description */}
      <div>
        <div className='flex items-center gap-3.5'>
          <div className='relative flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-tr from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-md shadow-emerald-500/25 transition-transform duration-300 hover:scale-105'>
            <div className='absolute inset-0 rounded-2xl bg-white/20 blur-xs pointer-events-none' />
            <FileSpreadsheet size={24} className='relative z-10' />
          </div>
          <div>
            <h1 className='text-2xl font-black text-slate-900 tracking-tight'>
              {t('reports.reports')}
            </h1>
            <p className='text-xs sm:text-sm text-slate-500 font-medium'>
              {t('reports.salesVsMargin')}
            </p>
          </div>
        </div>
      </div>

      {/* Controls & Actions */}
      <div className='flex flex-wrap items-center gap-2.5 sm:gap-3'>
        {/* Mode Toggle */}
        <div className='flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200/60'>
          <button type='button' onClick={() => onDateModeChange('MONTH')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition-all ${
              dateMode === 'MONTH' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}>
            <Calendar size={13} /> {t('reports.month')}
          </button>
          <button type='button' onClick={() => onDateModeChange('RANGE')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition-all ${
              dateMode === 'RANGE' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}>
            <CalendarRange size={13} /> {t('reports.range')}
          </button>
        </div>

        {/* Month Selector or Date Range */}
        {dateMode === 'MONTH' ? (
          <div className='relative flex items-center group'>
            <Calendar size={18} className='absolute left-3.5 text-emerald-600 pointer-events-none' />
            <select
              value={selectedMonth}
              onChange={(e) => onSelectMonth(e.target.value)}
              className='h-11 rounded-xl border border-slate-200 bg-white/90 pl-10 pr-9 text-xs sm:text-sm font-bold text-slate-800 shadow-xs transition hover:border-emerald-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer appearance-none'
            >
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className='absolute right-3.5 pointer-events-none text-xs text-slate-400'>▼</span>
          </div>
        ) : (
          <div className='flex items-center gap-2'>
            <input type='date' value={customStart} onChange={(e) => onCustomStartChange(e.target.value)}
              className='h-11 rounded-xl border border-indigo-200 bg-white px-3 text-xs font-bold text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer' />
            <span className='text-xs font-bold text-slate-400'>→</span>
            <input type='date' value={customEnd} onChange={(e) => onCustomEndChange(e.target.value)}
              className='h-11 rounded-xl border border-indigo-200 bg-white px-3 text-xs font-bold text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer' />
          </div>
        )}

        {/* Refresh Button */}
        <button
          type='button'
          onClick={onRefresh}
          disabled={isRefreshing}
          title='Refresh Data'
          className='flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-95 disabled:opacity-50 cursor-pointer'
        >
          <RefreshCw size={18} className={isRefreshing ? 'animate-spin text-emerald-600' : 'transition-transform hover:rotate-45'} />
        </button>

        {/* Export Data Button */}
        <button
          type='button'
          onClick={onOpenExportCenter}
          className='flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-500/20 active:scale-95 cursor-pointer'
        >
          <Download size={18} className='text-emerald-400' />
          <span>{t('reports.exportData')}</span>
        </button>
      </div>
    </div>
  );
}
