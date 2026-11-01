import { FileText, Printer } from 'lucide-react';

interface Props {
  readonly isGeneratingPdf: boolean;
  readonly isPrintingUSB: boolean;
  readonly isPrintingThermal: boolean;
  readonly onPreviewPdf: () => void;
  readonly onPrintUSB: () => void;
  readonly onPrintThermal: () => void;
  readonly onClose: () => void;
}

export function PosReceiptActions({
  isGeneratingPdf,
  isPrintingUSB,
  isPrintingThermal,
  onPreviewPdf,
  onPrintUSB,
  onPrintThermal,
  onClose,
}: Props) {
  return (
    <div className='flex flex-col gap-2 pt-2'>
      <div className='flex gap-2'>
        <button
          type='button'
          onClick={onPreviewPdf}
          disabled={isGeneratingPdf || isPrintingUSB}
          className='flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer disabled:opacity-50 transition'
        >
          <FileText size={16} />
          {isGeneratingPdf ? 'Generating...' : 'Preview PDF'}
        </button>
        <button
          type='button'
          onClick={onPrintUSB}
          disabled={isPrintingUSB || isGeneratingPdf}
          className='flex-1 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 py-2.5 text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50 transition'
        >
          <Printer size={16} />
          {isPrintingUSB ? 'Printing...' : 'Direct USB Print'}
        </button>
      </div>
      <div className='flex gap-2'>
        <button
          type='button'
          onClick={onPrintThermal}
          disabled={isPrintingThermal}
          className='w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-50 transition'
        >
          <Printer size={16} />
          {isPrintingThermal ? 'Printing (Browser)...' : 'Browser Print'}
        </button>
      </div>
      <div className='flex gap-2'>
        <button
          type='button'
          onClick={onClose}
          className='flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-700 cursor-pointer transition shadow-md shadow-emerald-600/20'
        >
          New Sale
        </button>
        <button
          type='button'
          onClick={onClose}
          className='flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition'
        >
          Done
        </button>
      </div>
    </div>
  );
}

