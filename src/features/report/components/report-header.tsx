import { Calendar, Download, FileSpreadsheet, RefreshCw } from 'lucide-react';
import type { MonthOption } from '../types/report.types';

interface Props {
  readonly selectedMonth: string;
  readonly onSelectMonth: (month: string) => void;
  readonly monthOptions: MonthOption[];
  readonly onExportExcel: () => void;
  readonly onExportCsv: () => void;
  readonly onRefresh: () => void;
  readonly isRefreshing?: boolean;
}

export function ReportHeader({
  selectedMonth,
  onSelectMonth,
  monthOptions,
  onExportExcel,
  onExportCsv,
  onRefresh,
  isRefreshing,
}: Props) {
  return (
    <div className='flex flex-col gap-5 md:flex-row md:items-center md:justify-between'>
      {/* Title & Description */}
      <div>
        <div className='flex items-center gap-3'>
          <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-tr from-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-500/20'>
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>
              Sales & Profit Margin Report
            </h1>
            <p className='text-sm text-slate-500'>
              Track monthly revenue, cost of goods, net margins, returns, and
              damages.
            </p>
          </div>
        </div>
      </div>

      {/* Controls & Actions */}
      <div className='flex flex-wrap items-center gap-3'>
        {/* Month Selector */}
        <div className='relative flex items-center'>
          <Calendar
            size={18}
            className='absolute left-3.5 text-slate-400 pointer-events-none'
          />
          <select
            value={selectedMonth}
            onChange={(e) => onSelectMonth(e.target.value)}
            className='h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer appearance-none'
          >
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className='absolute right-3.5 pointer-events-none text-xs text-slate-400'>
            ▼
          </span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title='Refresh Data'
          className='flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 cursor-pointer'
        >
          <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
        </button>

        {/* Download CSV */}
        <button
          onClick={onExportCsv}
          className='flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 cursor-pointer'
        >
          <Download size={16} />
          <span>Export CSV</span>
        </button>

        {/* Download Excel */}
        <button
          onClick={onExportExcel}
          className='flex h-11 items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl active:scale-[0.98] cursor-pointer'
        >
          <FileSpreadsheet size={18} />
          <span>Download Excel (.xlsx)</span>
        </button>
      </div>
    </div>
  );
}
