import { useState } from 'react';
import { Banknote, CreditCard, QrCode, X } from 'lucide-react';
import type { CartItem, PaymentMethod } from '../types/sell.types';

interface Props {
  readonly open: boolean;
  readonly items: CartItem[];
  readonly total: number;
  readonly isPending?: boolean;
  readonly onClose: () => void;
  readonly onConfirm: (params: {
    paymentMethod: PaymentMethod;
    amountPaid: number;
  }) => void;
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

export function PosCheckoutModal({
  open,
  total,
  isPending,
  onClose,
  onConfirm,
}: Props) {
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [amountPaidStr, setAmountPaidStr] = useState<string>('');

  if (!open) return null;

  const amountPaid = parseFloat(amountPaidStr) || total;
  const change = Math.max(0, amountPaid - total);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ paymentMethod: method, amountPaid });
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs'>
      <div className='w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-slate-100 pb-3'>
          <h3 className='text-lg font-bold text-slate-900'>Complete Payment</h3>
          <button
            onClick={onClose}
            className='rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer'
          >
            <X size={20} />
          </button>
        </div>

        {/* Total Amount Header */}
        <div className='rounded-2xl bg-emerald-50 p-4 text-center border border-emerald-100'>
          <p className='text-xs font-semibold text-emerald-800 uppercase tracking-wider'>
            Total Due
          </p>
          <p className='text-3xl font-extrabold text-emerald-600 mt-1'>
            {formatCurrency(total)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Payment Method Selector */}
          <div>
            <label className='block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider'>
              Select Payment Method
            </label>
            <div className='grid grid-cols-3 gap-2.5'>
              {[
                { id: 'CASH', label: 'Cash', icon: Banknote },
                { id: 'CARD', label: 'Card', icon: CreditCard },
                { id: 'QR', label: 'QR Pay', icon: QrCode },
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

          {/* Amount Paid (for Cash) */}
          {method === 'CASH' && (
            <div className='space-y-2'>
              <label className='block text-xs font-bold text-slate-700 uppercase tracking-wider'>
                Amount Tendered ($)
              </label>
              <input
                type='number'
                step='0.01'
                min={total}
                value={amountPaidStr}
                onChange={(e) => setAmountPaidStr(e.target.value)}
                placeholder={total.toFixed(2)}
                className='w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-base font-bold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
              />
              <div className='flex justify-between text-xs font-semibold text-slate-600 pt-1'>
                <span>Change to Return:</span>
                <span className='font-extrabold text-emerald-600'>
                  {formatCurrency(change)}
                </span>
              </div>
            </div>
          )}

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
