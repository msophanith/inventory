import { useEffect, useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';

interface Props {
  readonly open: boolean;
  readonly loading?: boolean;
  readonly productName: string;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
}

function ConfirmDeleteDialog({
  loading,
  productName,
  onClose,
  onConfirm,
}: Omit<Props, 'open'>) {
  const { t } = useLanguage();
  const [inputName, setInputName] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, loading]);

  const isMatched = inputName.trim() === productName.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMatched && !loading) {
      onConfirm();
    }
  };

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
            <h2 className='text-lg font-bold text-slate-900'>
              {t('products.deleteProduct')}
            </h2>
            <p className='text-xs font-medium text-slate-500'>
              {t('products.thisActionCannotBeUndone')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='p-5 sm:p-6'>
          <p className='text-sm text-slate-600 mb-4'>
            {t('products.areYouSureYouWantToDelete')}{' '}
            <span className='font-bold text-slate-800'>{productName}</span>?
            <br />
            {t('products.thisWillRemove')}
          </p>

          <div className='mb-6 space-y-2 rounded-2xl bg-rose-50/60 p-3.5 border border-rose-100'>
            <label
              htmlFor='confirm-product-name'
              className='block text-xs font-semibold text-slate-700'
            >
              {t('products.typeToConfirm')}{' '}
              <span className='select-all font-bold text-rose-600'>
                {productName}
              </span>
            </label>
            <input
              id='confirm-product-name'
              type='text'
              autoFocus
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder={productName}
              disabled={loading}
              autoComplete='off'
              className='w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:bg-slate-100 disabled:opacity-60 transition'
            />
          </div>

          <div className='flex flex-col sm:flex-row gap-3 w-full'>
            <button
              type='button'
              disabled={loading}
              onClick={onClose}
              className='flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 active:scale-95 transition-all cursor-pointer disabled:opacity-50'
            >
              {t('common.cancel')}
            </button>
            <button
              type='submit'
              disabled={loading || !isMatched}
              className='flex-1 flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/50 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500'
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
        </form>
      </div>
    </div>
  );
}

export default function ConfirmDeleteModal(props: Props) {
  if (!props.open) return null;
  return <ConfirmDeleteDialog {...props} />;
}
