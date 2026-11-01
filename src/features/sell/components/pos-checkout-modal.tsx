import { useEffect, useState } from 'react';
import { useLanguage } from '@/i18n/language-context';
import { User, X } from 'lucide-react';
import type { PaymentMethod } from '@/features/sell/types/sell.types';
import { formatCurrencyUsd } from '@/utils/currency';
import { PosCashPresets } from './pos-cash-presets';
import { PosCheckoutTotalDue } from './pos-checkout-total-due';
import { PosCheckoutMethods } from './pos-checkout-methods';
import { preloadSaleSounds } from '@/features/sell/utils/sale-sound';

interface Props {
  readonly open: boolean;
  readonly total: number;
  readonly isPending?: boolean;
  readonly onClose: () => void;
  readonly onConfirm: (params: {
    paymentMethod: PaymentMethod;
    amountPaid: number;
    customerNote?: string;
  }) => void;
}

export function PosCheckoutModal({
  open,
  total,
  isPending,
  onClose,
  onConfirm,
}: Props) {
  const { t } = useLanguage();
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [amountPaidStr, setAmountPaidStr] = useState<string>('');
  const [customerNote, setCustomerNote] = useState('');

  useEffect(() => {
    if (open) {
      preloadSaleSounds();
    }
  }, [open]);

  if (!open) return null;

  const amountPaid = Number.parseFloat(amountPaidStr) || total;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      paymentMethod: method,
      amountPaid: method === 'CASH' ? amountPaid : total,
      customerNote: customerNote.trim() || undefined,
    });
  };

  return (
    <div className='fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-slate-950/70 p-0 sm:p-4 backdrop-blur-md animate-in fade-in duration-200'>
      <div className='w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white p-4 pb-8 sm:p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-slate-100 pb-3'>
          <h3 className='text-lg font-bold text-slate-900'>{t('pos.completePayment')}</h3>
          <button
            type='button'
            onClick={onClose}
            className='rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer'
          >
            <X size={20} />
          </button>
        </div>

        {/* Total Amount Header */}
        <PosCheckoutTotalDue total={total} />

        {/* Payment Method Selector */}
        <PosCheckoutMethods method={method} onChangeMethod={setMethod} />

        {/* Payment Details */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          {method === 'CASH' && (
            <PosCashPresets
              total={total}
              amountPaid={amountPaid}
              onSelectAmount={(amt) => setAmountPaidStr(amt.toString())}
            />
          )}

          {/* Insufficient funds warning */}
          {method === 'CASH' && amountPaid > 0 && amountPaid < total && (
            <div className='flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700'>
              <span className='text-rose-500'>⚠</span>
              Insufficient — {formatCurrencyUsd(total - amountPaid)} short
            </div>
          )}

          {/* Customer Note */}
          <div>
            <label className='block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1'>
              <User size={12} /> {t('pos.customer')} / {t('pos.note')} <span className='text-slate-400 font-normal normal-case'>({t('pos.optional')})</span>
            </label>
            <input
              type='text'
              placeholder={t('pos.customerNotePlaceholder')}
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              className='w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition'
            />
          </div>

          {/* Actions */}
          <div className='flex gap-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isPending || (method === 'CASH' && amountPaid < total)}
              className='flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-extrabold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50 cursor-pointer'
            >
              {isPending ? t('pos.processing') : t('pos.confirmPayment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
