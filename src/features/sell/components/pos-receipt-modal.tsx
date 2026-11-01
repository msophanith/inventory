import { useState } from 'react';
import { CheckCircle2, Volume2 } from 'lucide-react';
import { useLanguage } from '@/i18n/language-context';
import type { ReceiptData } from '@/features/sell/types/sell.types';
import { formatDateTime } from '@/utils/date';
import { generatePdfInvoiceBlob } from '@/features/sell/utils/pdf-generator';
import { formatCurrencyUsd } from '@/utils/currency';
import { printThermalReceipt, printThermalReceiptWebUSB } from '@/features/sell/utils/thermal-printer';
import { playSaleCompletedSound } from '@/features/sell/utils/sale-sound';
import { PosReceiptItemList } from './pos-receipt-item-list';
import { PosReceiptActions } from './pos-receipt-actions';

interface Props {
  readonly receipt: ReceiptData | null;
  readonly onClose: () => void;
}

export function PosReceiptModal({ receipt, onClose }: Props) {
  const { t, language } = useLanguage();
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
          <div className='flex items-center gap-2'>
            <h3 className='text-lg font-extrabold text-slate-900'>
              {t('pos.saleSuccessful')}
            </h3>
            <button
              type='button'
              onClick={() => playSaleCompletedSound(language)}
              className='p-1.5 rounded-full text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition cursor-pointer'
              title='Replay vocal notification'
            >
              <Volume2 size={16} />
            </button>
          </div>
          <p className='text-xs text-slate-400 font-mono'>
            {t('pos.order')} #{receipt.orderId} • {formatDateTime(receipt.createdAt)}
          </p>
        </div>

        <PosReceiptItemList items={receipt.items} />

        <div className='border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600 font-medium'>
          <div className='flex justify-between py-2 border-t border-slate-100 mt-2'>
            <span className='font-bold text-slate-900'>{t('pos.paymentMethod')}</span>
            <span className='font-bold text-slate-700'>{receipt.paymentMethod}</span>
          </div>
          <div className='flex justify-between'>
            <span>{t('pos.cashier')}</span>
            <span className='font-bold text-slate-900'>{receipt.soldBy || 'Admin'}</span>
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

        <PosReceiptActions
          isGeneratingPdf={isGeneratingPdf}
          isPrintingUSB={isPrintingUSB}
          isPrintingThermal={isPrintingThermal}
          onPreviewPdf={handlePreviewPdf}
          onPrintUSB={handlePrintUSB}
          onPrintThermal={handlePrint}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
