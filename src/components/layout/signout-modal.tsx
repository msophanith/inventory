import { Loader2, LogOut, X } from 'lucide-react';
import { useLanguage } from '../../i18n/language-context';

interface Props {
  readonly show: boolean;
  readonly isLoggingOut: boolean;
  readonly userEmail?: string;
  readonly role?: string;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
}

export function SignoutModal({
  show,
  isLoggingOut,
  userEmail,
  onClose,
  onConfirm,
}: Props) {
  const { t } = useLanguage();
  if (!show) return null;

  return (
    <div
      className='fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200'
      onClick={onClose}
    >
      <div
        className='w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white p-4 pb-8 sm:p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-3.5'>
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-4 ring-rose-50/50 shadow-inner'>
              <LogOut size={22} />
            </div>
            <div>
              <h3 className='text-lg font-bold text-slate-900'>{t('common.signOut')}</h3>
              <p className='text-xs text-slate-500 font-medium'>{t('auth.signingOut')}</p>
            </div>
          </div>

          <button type='button' onClick={onClose} className='rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 transition'>
            <X size={18} />
          </button>
        </div>

        <p className='text-sm text-slate-600 leading-relaxed font-medium bg-slate-50/80 rounded-2xl p-4 border border-slate-100'>
          {t('auth.confirmSignOutDesc')} ({userEmail ?? ''})
        </p>

        <div className='flex gap-3 pt-1'>
          <button
            type='button'
            disabled={isLoggingOut}
            onClick={onClose}
            className='flex-1 rounded-xl border border-slate-200/80 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs disabled:opacity-50'
          >
            {t('common.cancel')}
          </button>
          <button
            type='button'
            disabled={isLoggingOut}
            onClick={onConfirm}
            className='flex-1 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-500/20 hover:from-rose-700 hover:to-red-700 transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60'
          >
            {isLoggingOut ? (
              <>
                <Loader2 size={15} className='animate-spin' />
                <span>{t('auth.signingOut')}</span>
              </>
            ) : (
              <>
                <LogOut size={15} />
                <span>{t('common.signOut')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
