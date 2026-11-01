import { Camera, ScanBarcode, Sparkles } from 'lucide-react';
import { useLanguage } from '@/i18n/language-context';

interface Props {
  readonly onOpenScanModal: () => void;
}

export function PosScannerEmptyState({ onOpenScanModal }: Props) {
  const { t } = useLanguage();

  return (
    <div className='relative overflow-hidden rounded-3xl border border-slate-200/90 bg-linear-to-b from-slate-50/60 via-white to-slate-50/40 p-6 sm:p-10 text-center shadow-xs space-y-4'>
      {/* Animated Viewfinder Box */}
      <div className='relative mx-auto flex h-28 w-36 items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 shadow-inner overflow-hidden'>
        <ScanBarcode size={44} className='text-indigo-400/80 transition transform group-hover:scale-105' />
        {/* Animated Scanning Laser Beam */}
        <div className='absolute inset-x-0 h-0.5 bg-linear-to-r from-transparent via-rose-500 to-transparent animate-pulse top-1/2 -translate-y-1/2 shadow-xs shadow-rose-500' />
        <div className='absolute inset-0 bg-linear-to-b from-rose-500/5 via-transparent to-rose-500/5 pointer-events-none' />
      </div>

      <div className='max-w-md mx-auto space-y-1'>
        <h3 className='text-base sm:text-lg font-black text-slate-900 flex items-center justify-center gap-1.5'>
          <Sparkles size={16} className='text-amber-500' />
          {t('pos.readyToScan')}
        </h3>
        <p className='text-xs sm:text-sm text-slate-500 font-medium leading-relaxed'>
          {t('pos.readyToScanDesc')}
        </p>
      </div>

      <div className='pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5'>
        <button
          type='button'
          onClick={onOpenScanModal}
          className='w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 active:scale-98 transition cursor-pointer'
        >
          <Camera size={16} />
          <span>{t('pos.openCameraScanner')}</span>
        </button>
      </div>

      <p className='text-[11px] text-slate-400 font-medium'>
        ⚡ {t('pos.scannerListening')}
      </p>
    </div>
  );
}

