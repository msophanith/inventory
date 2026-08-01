import { Camera, ChevronRight, ShoppingCart } from 'lucide-react';

interface Props {
  readonly itemCount: number;
  readonly totalAmount: number;
  readonly onOpenCartDrawer: () => void;
  readonly onOpenScanModal: () => void;
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

export function PosMobileCartBar({
  itemCount,
  totalAmount,
  onOpenCartDrawer,
  onOpenScanModal,
}: Props) {
  return (
    <div className='lg:hidden fixed bottom-16 sm:bottom-6 left-3 right-3 z-40 flex items-center gap-2 max-w-lg mx-auto'>
      {/* Quick Camera Barcode Scanner FAB */}
      <button
        type='button'
        onClick={onOpenScanModal}
        title='Scan Barcode with Camera'
        className='flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/20 active:scale-95 transition cursor-pointer shrink-0 border border-slate-700/50'
      >
        <Camera size={22} />
      </button>

      {/* Floating Sticky Cart Bar */}
      {itemCount > 0 ? (
        <button
          type='button'
          onClick={onOpenCartDrawer}
          className='flex-1 flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3.5 text-white shadow-xl shadow-emerald-600/30 active:scale-98 transition cursor-pointer border border-emerald-400/30'
        >
          <div className='flex items-center gap-3 min-w-0'>
            <div className='relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 shrink-0'>
              <ShoppingCart size={20} />
              <span className='absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[11px] font-extrabold text-slate-950 shadow-xs'>
                {itemCount}
              </span>
            </div>

            <div className='text-left min-w-0'>
              <p className='text-[11px] uppercase tracking-wider text-emerald-100 font-bold'>
                View Cart
              </p>
              <p className='text-base font-black truncate'>
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-1 text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1.5 rounded-xl shrink-0'>
            <span>Checkout</span>
            <ChevronRight size={16} />
          </div>
        </button>
      ) : (
        <button
          type='button'
          onClick={onOpenCartDrawer}
          className='flex-1 flex items-center justify-between gap-2 rounded-2xl bg-white/90 backdrop-blur-md px-4 py-3.5 text-slate-700 shadow-lg border border-slate-200 cursor-pointer'
        >
          <div className='flex items-center gap-2.5 text-xs font-bold text-slate-500'>
            <ShoppingCart size={18} className='text-slate-400' />
            <span>Cart is empty</span>
          </div>
          <span className='text-xs font-extrabold text-indigo-600'>Open Cart</span>
        </button>
      )}
    </div>
  );
}
