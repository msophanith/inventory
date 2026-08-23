import { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';

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
  const { t } = useLanguage();

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
        className='relative w-full max-w-md overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl shadow-slate-950/25 border border-slate-100 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 flex flex-col p-0'
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

        <div className='flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600'>
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 className='text-lg font-bold text-slate-900'>{t('products.deleteProduct')}</h2>
            <p className='text-xs font-medium text-slate-500'>
              {t('products.thisActionCannotBeUndone')}
            </p>
          </div>
        </div>

        <div className='p-5 sm:p-6'>
          <p className='text-sm text-slate-600 mb-8'>
            {t('products.areYouSureYouWantToDelete')} <span className='font-bold text-slate-800'>{productName}</span>?
            <br />
            {t('products.thisWillRemove')}
          </p>

          <div className='flex flex-col sm:flex-row gap-3 w-full'>
            <button
              type='button'
              disabled={loading}
              onClick={onClose}
              className='flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 active:scale-95 transition-all disabled:opacity-50'
            >
              {t('common.cancel')}
            </button>
            <button
              type='button'
              disabled={loading}
              onClick={onConfirm}
              className='flex-1 flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/50 active:scale-95 transition-all disabled:opacity-50'
            >
              {loading ? (
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
              ) : (
                <>
                  <Trash2 size={16} />
                  {t('common.delete')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
