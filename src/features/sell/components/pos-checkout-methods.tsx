import { Banknote, QrCode } from 'lucide-react';
import { useLanguage } from '@/i18n/language-context';
import type { PaymentMethod } from '@/features/sell/types/sell.types';

interface Props {
  readonly method: PaymentMethod;
  readonly onChangeMethod: (method: PaymentMethod) => void;
}

export function PosCheckoutMethods({ method, onChangeMethod }: Props) {
  const { t } = useLanguage();

  const methods = [
    { id: 'CASH', label: t('pos.cash'), icon: Banknote },
    { id: 'QR', label: t('pos.khqr'), icon: QrCode },
  ] as const;

  return (
    <div>
      <label className='block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider'>
        {t('pos.paymentMethod')}
      </label>
      <div className='grid grid-cols-2 gap-2'>
        {methods.map((m) => {
          const Icon = m.icon;
          const active = method === m.id;
          return (
            <button
              key={m.id}
              type='button'
              onClick={() => onChangeMethod(m.id as PaymentMethod)}
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
  );
}

