import { formatCurrencyKhr, formatCurrencyUsd } from '@/utils/currency';

interface Props {
  readonly total: number;
}

export function PosCheckoutTotalDue({ total }: Props) {
  return (
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
  );
}

