import { useEffect } from 'react';
import { X } from 'lucide-react';

import StockMovementHeader from './stock-movement-header';
import MovementForm, { type FormValues } from './movement-form';
import type { MovementType } from '../../../services/movement';
import type { Product } from '../../../services/product';

interface Props {
  readonly open: boolean;
  readonly type: MovementType;
  readonly product: Product;
  readonly loading?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: FormValues) => void;
}

export default function StockMovementModal({
  open,
  type,
  product,
  loading,
  onClose,
  onSubmit,
}: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className='fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-slate-950/75 p-0 sm:p-4 backdrop-blur-md animate-in fade-in duration-200'
    >
      <div
        className='relative w-full max-w-lg max-h-[92vh] sm:max-h-[85vh] overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl shadow-slate-950/25 border border-slate-100 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 flex flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className='relative shrink-0'>
          <StockMovementHeader type={type} product={product} />

          <button
            type='button'
            onClick={onClose}
            title='Close modal'
            className='absolute right-4 top-4 sm:right-5 sm:top-5 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/35 transition-all cursor-pointer active:scale-90 border border-white/20 backdrop-blur-md shadow-xs'
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body with Sticky Footer */}
        <MovementForm
          type={type}
          product={product}
          loading={loading}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}