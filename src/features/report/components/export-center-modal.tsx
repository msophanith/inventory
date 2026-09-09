import { useMemo } from 'react';
import { X, Download, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';
import type { ExportType } from './report-export-modals';
import { ExportOptionCard } from './export-option-card';
import { getExportOptions } from '../utils/export-options-config';

interface Props {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSelectExport: (type: ExportType) => void;
}

export function ExportCenterModal({ isOpen, onClose, onSelectExport }: Props) {
  const { t } = useLanguage();

  const exportOptions = useMemo(() => getExportOptions(t), [t]);

  if (!isOpen) return null;

  return (
    <div
      role='dialog'
      aria-modal='true'
      className='fixed inset-0 z-9999 flex h-dvh w-screen min-h-screen items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200'
      onClick={onClose}
    >
      <div
        className='relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='relative border-b border-slate-100 bg-slate-50/60 p-5 sm:p-6'>
          <button
            type='button'
            onClick={onClose}
            className='absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-700 cursor-pointer'
          >
            <X size={20} />
          </button>
          <div className='flex items-center gap-3.5'>
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-900 text-white shadow-md shadow-slate-900/20'>
              <Download size={22} className='text-emerald-400' />
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <h2 className='text-xl font-black text-slate-900 tracking-tight'>
                  {t('reports.exportCenter')}
                </h2>
                <span className='rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800 border border-emerald-200/60'>
                  5 Formats
                </span>
              </div>
              <p className='text-xs sm:text-sm text-slate-500 font-medium mt-0.5'>
                {t('reports.chooseExportFormat')}
              </p>
            </div>
          </div>
        </div>

        <div className='p-5 sm:p-6 bg-slate-50/30 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-hide'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {exportOptions.map((opt) => (
              <ExportOptionCard
                key={opt.id}
                option={opt}
                onSelect={(id) => {
                  onClose();
                  onSelectExport(id);
                }}
              />
            ))}
          </div>
        </div>

        <div className='flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-6 py-3.5 text-xs font-semibold text-slate-500'>
          <div className='flex items-center gap-1.5 text-slate-500'>
            <ShieldCheck size={14} className='text-emerald-600' />
            <span>Optional ZIP encryption available on export</span>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
