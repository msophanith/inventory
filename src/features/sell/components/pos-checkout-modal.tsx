import { useState } from 'react';
import { Banknote, QrCode, User, X } from 'lucide-react';
import type { PaymentMethod } from '../types/sell.types';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';
import { PosCashPresets } from './pos-cash-presets';

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
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [amountPaidStr, setAmountPaidStr] = useState<string>('');
  const [customerNote, setCustomerNote] = useState('');

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
          <h3 className='text-lg font-bold text-slate-900'>Complete Payment</h3>
          <button
            type='button'
            onClick={onClose}
            className='rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer'
          >
            <X size={20} />
          </button>
        </div>

        {/* Total Amount Header */}
        <div className='rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50 p-3.5 text-center border border-emerald-100/80 shadow-inner'>
          <p className='text-xs font-extrabold text-emerald-800 uppercase tracking-wider'>
            Total Due
          </p>
          <p className='text-3xl font-black text-emerald-600 mt-0.5 leading-tight'>
            {formatCurrencyUsd(total)}
          </p>
          <p className='text-sm font-extrabold text-indigo-600 mt-0.5'>
            {formatCurrencyKhr(total)}
          </p>
        </div>

        {/* Payment Method Selector */}
        <div>
          <label className='block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider'>
            Select Payment Method
          </label>
          <div className='grid grid-cols-2 gap-2'>
            {[
              { id: 'CASH', label: 'Cash', icon: Banknote },
              { id: 'QR', label: 'KHQR Pay', icon: QrCode },
            ].map((m) => {
              const Icon = m.icon;
              const active = method === m.id;
              return (
                <button
                  key={m.id}
                  type='button'
                  onClick={() => setMethod(m.id as PaymentMethod)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs font-bold transition cursor-pointer ${
                    active
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

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
              <User size={12} /> Customer / Note <span className='text-slate-400 font-normal normal-case'>(optional)</span>
            </label>
            <input
              type='text'
              placeholder='e.g. John Doe, Table 3, wholesale...'
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
              {isPending ? 'Processing...' : 'Confirm Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
