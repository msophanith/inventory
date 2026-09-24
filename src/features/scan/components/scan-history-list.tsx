import { ArrowRight, CheckCircle2, Copy, History, PlusCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { gooeyToast } from 'goey-toast';
import { useLanguage } from '../../../i18n/language-context';
import type { ScanHistoryItem } from '../types';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';

interface Props {
  readonly history: ScanHistoryItem[];
  readonly onClearHistory: () => void;
  readonly onSelectBarcode?: (barcode: string) => void;
}

export function ScanHistoryList({ history, onClearHistory, onSelectBarcode }: Props) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleCopyAll = () => {
    if (history.length === 0) return;
    const barcodes = history.map((h) => h.barcode).join('\n');
    navigator.clipboard?.writeText(barcodes);
    gooeyToast.success(t('scan.allBarcodesCopied'));
  };

  return (
    <div className='rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs space-y-3.5'>
      {/* Header with Title & Action Controls */}
      <div className='flex items-center justify-between border-b border-slate-100 pb-3'>
        <div className='flex items-center gap-2'>
          <div className='flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600'>
            <History size={15} />
          </div>
          <h2 className='text-xs sm:text-sm font-black text-slate-900'>
            {t('scan.recentScans')}
          </h2>
          <span className='rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600'>
            {history.length}
          </span>
        </div>

        {history.length > 0 && (
          <div className='flex items-center gap-1.5'>
            <button
              type='button'
              onClick={handleCopyAll}
              title={t('scan.exportBarcodes')}
              className='p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer'
            >
              <Copy size={14} />
            </button>
            <button
              type='button'
              onClick={onClearHistory}
              title={t('scan.clearHistory')}
              className='p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer'
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* History Items Feed */}
      {history.length === 0 ? (
        <div className='py-6 text-center text-slate-400'>
          <p className='text-xs font-semibold'>{t('scan.noRecentScans')}</p>
        </div>
      ) : (
        <div className='space-y-1.5 max-h-60 overflow-y-auto pr-1'>
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (onSelectBarcode) {
                  onSelectBarcode(item.barcode);
                } else if (item.found && item.productId) {
                  navigate(`/products/${item.productId}`);
                } else {
                  navigate(`/products/create?barcode=${encodeURIComponent(item.barcode)}`);
                }
              }}
              className='flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-2.5 hover:bg-slate-100/90 transition cursor-pointer active:scale-99'
            >
              <div className='flex items-center gap-2.5 min-w-0'>
                {item.found ? (
                  <CheckCircle2 size={16} className='text-emerald-500 shrink-0' />
                ) : (
                  <PlusCircle size={16} className='text-amber-500 shrink-0' />
                )}
                <div className='min-w-0'>
                  <p className='text-xs font-bold text-slate-900 truncate'>
                    {item.found ? item.productName : `"${item.barcode}"`}
                  </p>
                  <p className='text-[10px] text-slate-400 font-mono'>
                    {item.barcode}
                    {item.sellPrice !== undefined && (
                      <span className='ml-1.5 font-sans font-bold text-emerald-600'>
                        {formatCurrencyUsd(item.sellPrice)} ({formatCurrencyKhr(item.sellPrice)})
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-1 shrink-0'>
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                    item.found ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {item.found ? t('scan.found') : t('scan.create')}
                </span>
                <ArrowRight size={13} className='text-slate-300' />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
