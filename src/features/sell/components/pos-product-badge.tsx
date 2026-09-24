import { AlertTriangle, Ban } from 'lucide-react';

interface Props {
  readonly isOutOfStock: boolean;
  readonly isMaxInCart: boolean;
  readonly isLowStock: boolean;
  readonly remainingStock: number;
}

export function PosProductBadge({
  isOutOfStock,
  isMaxInCart,
  isLowStock,
  remainingStock,
}: Props) {
  const badgeBase =
    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white shadow-md';

  if (isOutOfStock) {
    return (
      <span className={`${badgeBase} bg-rose-600 ring-1 ring-white/30 animate-pulse`}>
        <Ban size={10} strokeWidth={2.5} /> Out of Stock
      </span>
    );
  }
  if (isMaxInCart) {
    return (
      <span className={`${badgeBase} bg-rose-500`}>
        <Ban size={10} strokeWidth={2.5} /> Max In Cart
      </span>
    );
  }
  if (isLowStock) {
    return (
      <span className={`${badgeBase} bg-amber-500 ring-1 ring-white/40`}>
        <AlertTriangle size={10} strokeWidth={2.5} /> Low: {remainingStock}
      </span>
    );
  }
  return (
    <span className='inline-flex items-center rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-md shadow-xs'>
      {remainingStock} left
    </span>
  );
}
