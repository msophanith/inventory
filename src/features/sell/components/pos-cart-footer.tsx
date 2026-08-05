import { CreditCard, FileText } from 'lucide-react';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';

interface Props {
  readonly subtotal: number;
  readonly tax: number;
  readonly totalAmount: number;
  readonly hasItems: boolean;
  readonly isGeneratingPdf: boolean;
  readonly onPreviewPdf: () => void;
  readonly onCheckout: () => void;
}

export function PosCartFooter({
  subtotal,
  tax,
  totalAmount,
  hasItems,
  isGeneratingPdf,
  onPreviewPdf,
  onCheckout,
}: Props) {
  return (
    <div className='border-t border-slate-100 pt-4 space-y-3'>
      <div className='space-y-1.5 text-xs text-slate-600 font-medium'>
        <div className='flex justify-between'>
          <span>Subtotal</span>
          <span>{formatCurrencyUsd(subtotal)}</span>
        </div>
        {tax > 0 && (
          <div className='flex justify-between'>
            <span>Tax</span>
            <span>{formatCurrencyUsd(tax)}</span>
          </div>
        )}
        <div className='flex justify-between items-baseline pt-2 border-t border-slate-100'>
          <span className='font-bold text-slate-900 text-sm'>Total Payable</span>
          <div className='text-right'>
            <span className='text-lg font-black text-emerald-600 block leading-tight'>
              {formatCurrencyUsd(totalAmount)}
            </span>
            <span className='text-xs font-extrabold text-indigo-600 block'>
              {formatCurrencyKhr(totalAmount)}
            </span>
          </div>
        </div>
      </div>

      <div className='flex gap-2'>
        <button
          disabled={!hasItems || isGeneratingPdf}
          onClick={onPreviewPdf}
          title='Preview PDF Invoice'
          className='flex items-center justify-center gap-1.5 rounded-2xl border border-indigo-200 bg-indigo-50 px-3 py-3 text-xs font-bold text-indigo-700 hover:bg-indigo-100 disabled:opacity-40 transition cursor-pointer'
        >
          <FileText size={16} />
          <span>PDF</span>
        </button>

        <button
          disabled={!hasItems}
          onClick={onCheckout}
          className='flex-1 flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/20 transition hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 cursor-pointer active:scale-98'
        >
          <CreditCard size={18} />
          <span>Proceed to Checkout</span>
        </button>
      </div>
    </div>
  );
}
