import {
  X,
  FileSpreadsheet,
  Download,
  Zap,
  PackagePlus,
  Box,
} from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';

type ExportType =
  | 'EXCEL'
  | 'MONTH_CSV'
  | 'TODAY_CSV'
  | 'PRODUCT_IN_EXCEL'
  | 'NEW_PRODUCT_EXCEL';

interface Props {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSelectExport: (type: ExportType) => void;
}

export function ExportCenterModal({ isOpen, onClose, onSelectExport }: Props) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const exportOptions = [
    {
      id: 'EXCEL' as const,
      title: t('reports.fullSalesMargin'),
      description: t('reports.fullSalesMarginDesc'),
      icon: <FileSpreadsheet size={24} className='text-emerald-500' />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      hover: 'hover:border-emerald-400 hover:shadow-emerald-500/20',
      format: '.xlsx',
    },
    {
      id: 'PRODUCT_IN_EXCEL' as const,
      title: t('reports.monthlyStockIn'),
      description: t('reports.monthlyStockInDesc'),
      icon: <Download size={24} className='text-blue-500' />,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      hover: 'hover:border-blue-400 hover:shadow-blue-500/20',
      format: '.xlsx',
    },
    {
      id: 'NEW_PRODUCT_EXCEL' as const,
      title: t('reports.newProductsAdded'),
      description: t('reports.newProductsAddedDesc'),
      icon: <PackagePlus size={24} className='text-purple-500' />,
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      hover: 'hover:border-purple-400 hover:shadow-purple-500/20',
      format: '.xlsx',
    },
    {
      id: 'MONTH_CSV' as const,
      title: t('reports.monthlySummary'),
      description: t('reports.monthlySummaryDesc'),
      icon: <Box size={24} className='text-slate-500' />,
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      hover: 'hover:border-slate-400 hover:shadow-slate-500/20',
      format: '.csv',
    },
    {
      id: 'TODAY_CSV' as const,
      title: t('reports.todaysSales'),
      description: t('reports.todaysSalesDesc'),
      icon: <Zap size={24} className='text-amber-500 fill-amber-500/20' />,
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      hover: 'hover:border-amber-400 hover:shadow-amber-500/20',
      format: '.csv',
    },
  ];

  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200'>
      <button
        type='button'
        className='w-full max-w-3xl scale-100 overflow-hidden rounded-3xl bg-white/95 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='relative border-b border-slate-100 bg-slate-50/50 p-6'>
          <button
            type='button'
            onClick={onClose}
            className='absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 cursor-pointer'
          >
            <X size={20} />
          </button>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-white shadow-lg'>
              <Download size={24} />
            </div>
            <div>
              <h2 className='text-xl font-black text-slate-800 tracking-tight'>
                {t('reports.exportCenter')}
              </h2>
              <p className='text-sm text-slate-500 font-medium mt-0.5'>
                {t('reports.chooseExportFormat')}
              </p>
            </div>
          </div>
        </div>

        <div className='p-6 bg-white'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {exportOptions.map((opt) => (
              <button
                key={opt.id}
                type='button'
                onClick={() => {
                  onClose();
                  onSelectExport(opt.id);
                }}
                className={`group flex items-start gap-4 rounded-2xl border ${opt.border} bg-white p-4 text-left shadow-sm transition-all duration-200 ${opt.hover} hover:shadow-lg cursor-pointer active:scale-[0.98]`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${opt.bg} transition-transform group-hover:scale-110 group-hover:rotate-3`}
                >
                  {opt.icon}
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <h3 className='font-bold text-slate-800'>{opt.title}</h3>
                    <span className='rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 tracking-wider'>
                      {opt.format}
                    </span>
                  </div>
                  <p className='mt-1 text-xs text-slate-500 leading-relaxed font-medium line-clamp-2'>
                    {opt.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </button>
    </div>
  );
}
