import { useState } from 'react';
import { CheckCircle2, FileText, PackageCheck, Printer } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';
import type { ReceiptData } from '../types/sell.types';
import { formatDateTime } from '../../../utils/date';
import { generatePdfInvoiceBlob } from '../utils/pdf-generator';
import { formatCurrencyUsd } from '../../../utils/currency';
import { printThermalReceipt, printThermalReceiptWebUSB } from '../utils/thermal-printer';

interface Props {
  readonly receipt: ReceiptData | null;
  readonly onClose: () => void;
}

export function PosReceiptModal({ receipt, onClose }: Props) {
  const { t } = useLanguage();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPrintingThermal, setIsPrintingThermal] = useState(false);
  const [isPrintingUSB, setIsPrintingUSB] = useState(false);

  if (!receipt) return null;

  const handlePrint = async () => {
    if (!receipt) return;
    try {
      setIsPrintingThermal(true);
      await printThermalReceipt(receipt);
    } catch (err) {
      console.error('Failed to print thermal receipt:', err);
    } finally {
      setIsPrintingThermal(false);
    }
  };

  const handlePrintUSB = async () => {
    if (!receipt) return;
    try {
      setIsPrintingUSB(true);
      await printThermalReceiptWebUSB(receipt);
    } catch (err) {
      console.error('Failed to print thermal receipt via WebUSB:', err);
      alert(err instanceof Error ? err.message : 'USB Print failed');
    } finally {
      setIsPrintingUSB(false);
    }
  };

  const handlePreviewPdf = async () => {
    if (!receipt) return;
    try {
      setIsGeneratingPdf(true);
      const pdfBlob = await generatePdfInvoiceBlob(receipt);
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error generating PDF invoice:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className='fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200'>
      <div className='w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white p-4 pb-8 sm:p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200'>
        <div className='flex flex-col items-center text-center space-y-2'>
          <div className='flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner'>
            <CheckCircle2 size={32} />
          </div>
          <h3 className='text-lg font-extrabold text-slate-900'>
            {t('pos.saleSuccessful')}
          </h3>
          <p className='text-xs text-slate-400 font-mono'>
            {t('pos.order')} #{receipt.orderId} • {formatDateTime(receipt.createdAt)}
          </p>
        </div>

        <div className='rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs space-y-2.5 max-h-52 overflow-y-auto'>
          {receipt.items.map((i) => {
            const remainingStock = Math.max(0, i.product.quantity - i.quantity);
            const isLow = remainingStock <= (i.product.minStock || 2);

            return (
              <div
                key={i.product.id}
                className='flex flex-col gap-1 border-b border-slate-200/60 pb-2 last:border-0 last:pb-0'
              >
                <div className='flex justify-between font-bold text-slate-800'>
                  <span>
                    {i.quantity} {i.unit || i.product.unit || 'pcs'} of {i.product.name}
                  </span>
                  <span className='font-extrabold text-slate-900'>
                    {formatCurrencyUsd(i.totalPrice)}
                  </span>
                </div>
                <div className='flex items-center justify-between text-[11px] text-slate-500 font-medium'>
                  <span className='flex items-center gap-1 text-slate-400'>
                    <PackageCheck size={12} /> {t('pos.remainingStock')}:
                  </span>
                  <span
                    className={`font-bold rounded-full px-2 py-0.5 text-[10px] ${isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}
                  >
                    {remainingStock} {i.product.unit || 'units'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className='border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600 font-medium'>
          <div className='flex justify-between py-2 border-t border-slate-100 mt-2'>
            <span className='font-bold text-slate-900'>{t('pos.paymentMethod')}</span>
            <span className='font-bold text-slate-700'>{receipt.paymentMethod}</span>
          </div>
          <div className='flex justify-between'>
            <span>{t('pos.cashier')}</span>
            <span className='font-bold text-slate-900'>
              {receipt.soldBy || 'Admin'}
            </span>
          </div>
          {receipt.discount > 0 && (
            <div className='flex justify-between font-bold text-rose-500'>
              <span>{t('pos.discount')}</span>
              <span>-{formatCurrencyUsd(receipt.discount)}</span>
            </div>
          )}
          <div className='flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100 mt-1'>
            <span>{t('pos.totalAmount')}</span>
            <span>{formatCurrencyUsd(receipt.total)}</span>
          </div>
          <div className='flex justify-between pt-1 border-t border-slate-200 border-dashed'>
            <span>{t('pos.amountPaid')}</span>
            <span>{formatCurrencyUsd(receipt.amountPaid)}</span>
          </div>
          <div className='flex justify-between'>
            <span>{t('pos.change')}</span>
            <span>{formatCurrencyUsd(receipt.change)}</span>
          </div>
        </div>

        <div className='flex flex-col gap-2 pt-2'>
          <div className='flex gap-2'>
            <button
              type='button'
              onClick={handlePreviewPdf}
              disabled={isGeneratingPdf || isPrintingUSB}
              className='flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer disabled:opacity-50 transition'
            >
              <FileText size={16} />{' '}
              {isGeneratingPdf ? 'Generating...' : 'Preview PDF'}
            </button>
            <button
              type='button'
              onClick={handlePrintUSB}
              disabled={isPrintingUSB || isGeneratingPdf}
              className='flex-1 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 py-2.5 text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50 transition'
            >
              <Printer size={16} /> {isPrintingUSB ? 'Printing...' : 'Direct USB Print'}
            </button>
          </div>
          <div className='flex gap-2'>
             <button
                type='button'
                onClick={handlePrint}
                disabled={isPrintingThermal}
                className='w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-50 transition'
              >
                <Printer size={16} /> {isPrintingThermal ? 'Printing (Browser)...' : 'Browser Print'}
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
      </div>
    </div>
  );
}
