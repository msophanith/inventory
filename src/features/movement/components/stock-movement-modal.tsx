import { useEffect } from 'react';
import { createPortal } from 'react-dom';

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
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
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

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      onClick={onClose}
      className='fixed inset-0 z-[9999] h-screen h-dvh w-screen min-h-screen flex items-end sm:items-center justify-center bg-slate-950/70 p-0 sm:p-4 backdrop-blur-sm animate-in fade-in duration-150'
    >
      <div
        className='relative w-full max-w-md max-h-[92vh] sm:max-h-[88vh] overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl shadow-slate-950/25 border border-slate-200/80 animate-in slide-in-from-bottom sm:zoom-in-95 duration-150 flex flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section with integrated close button */}
        <StockMovementHeader type={type} product={product} onClose={onClose} />

        {/* Form Body with Sticky Footer */}
        <MovementForm
          type={type}
          product={product}
          loading={loading}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </div>
    </div>,
    document.body,
  );
}
