import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface Props {
  readonly open: boolean;
  readonly loading?: boolean;
  readonly productName: string;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
}

export default function ConfirmDeleteModal({
  open,
  loading,
  productName,
  onClose,
  onConfirm,
}: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, loading]);

  if (!open) return null;

  return (
    <div
      onClick={!loading ? onClose : undefined}
      className='fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-slate-950/75 p-0 sm:p-4 backdrop-blur-md animate-in fade-in duration-200'
    >
      <div
        className='relative w-full max-w-md overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl shadow-slate-950/25 border border-slate-100 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 flex flex-col p-6 sm:p-8 text-center'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type='button'
          onClick={!loading ? onClose : undefined}
          disabled={loading}
          className='absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all cursor-pointer disabled:opacity-50'
        >
          <X size={18} />
        </button>

        <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 mb-6'>
          <AlertTriangle size={32} className='text-rose-600' />
        </div>

        <h3 className='text-xl font-extrabold text-slate-900 mb-2'>Delete Product</h3>
        <p className='text-sm text-slate-500 mb-8'>
          Are you sure you want to delete <span className='font-bold text-slate-800'>{productName}</span>? This action cannot be undone and will remove all associated data.
        </p>

        <div className='flex flex-col sm:flex-row gap-3 w-full'>
          <button
            type='button'
            onClick={onClose}
            disabled={loading}
            className='flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={onConfirm}
            disabled={loading}
            className='flex-1 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-bold text-white hover:bg-rose-600 shadow-md shadow-rose-500/20 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            {loading ? (
              <>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Yes, Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
