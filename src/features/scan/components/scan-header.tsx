import { QrCode, Settings, Wifi } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';

interface Props {
  readonly isListening: boolean;
  readonly onOpenSettings: () => void;
  readonly autoRedirect: boolean;
}

export function ScanHeader({ isListening, onOpenSettings, autoRedirect }: Props) {
  const { t } = useLanguage();

  return (
    <div className='flex items-center justify-between gap-3 px-1 sm:px-0'>
      {/* Title & Terminal Identity */}
      <div className='flex items-center gap-2.5 min-w-0'>
        <div className='flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 via-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/25 shrink-0'>
          <QrCode size={22} className='animate-pulse' />
        </div>
        <div className='min-w-0'>
          <h1 className='text-base sm:text-lg font-black tracking-tight text-slate-900 truncate'>
            {t('scan.scanLookupTerminal')}
          </h1>
          <div className='flex items-center gap-1.5 mt-0.5'>
            <span className='relative flex h-2 w-2'>
              {isListening && (
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75' />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isListening ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </span>
            <span className='text-[11px] font-semibold text-slate-500 truncate'>
              {isListening ? t('scan.hardwareScannerReady') : t('scan.scannerPaused')}
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls: Status Pill & Settings Button */}
      <div className='flex items-center gap-2 shrink-0'>
        <div className='hidden sm:flex items-center gap-1.5 rounded-full bg-slate-900/5 px-2.5 py-1 text-slate-600 border border-slate-200/60'>
          <Wifi size={12} className={isListening ? 'text-emerald-600' : 'text-amber-500'} />
          <span className='text-[10px] font-bold tracking-wide uppercase'>USB / BT</span>
        </div>

        <button
          type='button'
          onClick={onOpenSettings}
          title={t('scan.settings')}
          className='relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer active:scale-95'
        >
          <Settings size={18} />
          {autoRedirect && (
            <span className='absolute -top-1 -right-1 flex h-3 w-3'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75' />
              <span className='relative inline-flex rounded-full h-3 w-3 bg-indigo-600 border-2 border-white' />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
