import { useNavigate } from 'react-router-dom';
import { AlertCircle, Check, Copy, Plus, RotateCcw, X } from 'lucide-react';
import { useState } from 'react';
import { gooeyToast } from 'goey-toast';
import { useLanguage } from '../../../i18n/language-context';

interface Props {
  readonly barcode: string;
  readonly onDismiss: () => void;
}

export function ScanNotFoundResult({ barcode, onDismiss }: Props) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(barcode);
    setCopied(true);
    gooeyToast.success(t('scan.copiedBarcode'));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xl shadow-slate-900/5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200'>
      {/* Top Meta Bar */}
      <div className='flex items-center justify-between'>
        <div className='inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-amber-700 border border-amber-200/60'>
          <span className='h-2 w-2 rounded-full bg-amber-500' />
          <span className='text-[10px] font-extrabold uppercase tracking-wider'>
            {t('scan.productNotFound')}
          </span>
        </div>

        <button
          type='button'
          onClick={onDismiss}
          title={t('scan.dismiss')}
          className='flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer'
        >
          <X size={16} />
        </button>
      </div>

      {/* Main Notice */}
      <div className='flex items-start gap-3.5'>
        <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 shrink-0 shadow-inner'>
          <AlertCircle size={24} />
        </div>

        <div className='flex-1 min-w-0'>
          <h3 className='text-sm sm:text-base font-black text-slate-900'>
            {t('scan.barcodeNotFound', { barcode })}
          </h3>

          <div className='mt-2 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-mono font-bold text-slate-700'>
            <span>{barcode}</span>
            <button
              type='button'
              onClick={handleCopy}
              className='p-0.5 text-slate-400 hover:text-slate-600 transition cursor-pointer'
            >
              {copied ? <Check size={12} className='text-emerald-600' /> : <Copy size={12} />}
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons: Primary Create & Secondary Dismiss */}
      <div className='space-y-2 pt-1'>
        <button
          type='button'
          onClick={() => navigate(`/products/create?barcode=${encodeURIComponent(barcode)}`)}
          className='flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 text-xs sm:text-sm font-black text-white shadow-md hover:bg-slate-800 transition active:scale-[0.98] cursor-pointer'
        >
          <Plus size={16} />
          <span>{t('scan.createProduct')}</span>
        </button>

        <button
          type='button'
          onClick={onDismiss}
          className='flex h-10 w-full items-center justify-center gap-1.5 rounded-2xl border border-slate-200/80 bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-100 active:scale-95 cursor-pointer'
        >
          <RotateCcw size={14} className='text-slate-500' />
          <span>{t('scan.scanNext')}</span>
        </button>
      </div>
    </div>
  );
}
