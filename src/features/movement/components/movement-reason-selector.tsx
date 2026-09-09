import {
  AlertTriangle,
  ArrowLeftRight,
  FileQuestion,
  PackageCheck,
  RotateCcw,
  ShoppingBag,
  SlidersHorizontal,
  Truck,
} from 'lucide-react';
import type { MovementType } from '../../../services/movement';

interface Props {
  readonly type: MovementType;
  readonly selectedReason: string;
  readonly onSelectReason: (reason: string) => void;
}

interface Option {
  value: string;
  label: string;
  icon: typeof PackageCheck;
  isDamaged?: boolean;
}

const IN_REASONS: Option[] = [
  { value: 'Purchase', label: 'Purchase', icon: PackageCheck },
  { value: 'Return', label: 'Vendor Return', icon: RotateCcw },
  { value: 'Transfer In', label: 'Transfer In', icon: Truck },
  { value: 'Adjustment', label: 'Adjustment', icon: SlidersHorizontal },
];

const OUT_REASONS: Option[] = [
  { value: 'Sale', label: 'Sale', icon: ShoppingBag },
  { value: 'Damage', label: 'Damaged', icon: AlertTriangle, isDamaged: true },
  { value: 'Transfer Out', label: 'Transfer', icon: Truck },
  { value: 'Adjustment', label: 'Adjustment', icon: SlidersHorizontal },
];

const RETURN_REASONS: Option[] = [
  { value: 'Customer Return', label: 'Normal Return', icon: RotateCcw },
  { value: 'Damage', label: 'Damaged Item', icon: AlertTriangle, isDamaged: true },
  { value: 'Exchange', label: 'Exchange', icon: ArrowLeftRight },
  { value: 'Wrong Item', label: 'Wrong Item', icon: FileQuestion },
];

export default function MovementReasonSelector({
  type,
  selectedReason,
  onSelectReason,
}: Props) {
  const options =
    type === 'IN' ? IN_REASONS : type === 'OUT' ? OUT_REASONS : RETURN_REASONS;
  const isDamaged = selectedReason === 'Damage';

  return (
    <div className='space-y-1.5'>
      <div className='flex items-center justify-between text-xs'>
        <span className='font-black uppercase tracking-wider text-slate-700'>
          Reason
        </span>
        <span className='text-[10px] font-semibold text-slate-400'>Tap to select</span>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-4 gap-1.5'>
        {options.map((opt) => {
          const Icon = opt.icon;
          const active = selectedReason === opt.value;
          return (
            <button
              key={opt.value}
              type='button'
              onClick={() => onSelectReason(opt.value)}
              className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 px-2 text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                active
                  ? opt.isDamaged
                    ? 'border-amber-400 bg-amber-50 text-amber-800 ring-2 ring-amber-400/20 shadow-2xs'
                    : 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600/20 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon
                size={13}
                className={active ? (opt.isDamaged ? 'text-amber-600' : 'text-indigo-600') : 'text-slate-400'}
              />
              <span className='truncate'>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {isDamaged && (
        <p className='text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1 flex items-center gap-1.5'>
          <AlertTriangle size={13} className='text-amber-600 shrink-0' />
          <span>Damaged: Not added to sellable stock (recorded as write-off loss).</span>
        </p>
      )}
    </div>
  );
}
