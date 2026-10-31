import { Camera, Search } from 'lucide-react';
import { useLanguage } from '@/i18n/language-context';

interface Props {
  readonly isCameraActive: boolean;
  readonly onSelectMode: (useCamera: boolean) => void;
}

export function ScanModeSelector({ isCameraActive, onSelectMode }: Props) {
  const { t } = useLanguage();

  return (
    <div className='grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100/90 border border-slate-200/70'>
      <button
        type='button'
        onClick={() => onSelectMode(false)}
        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
          !isCameraActive
            ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
      >
        <Search size={14} className={!isCameraActive ? 'text-indigo-600' : 'text-slate-400'} />
        <span className='truncate'>{t('scan.modeGunManual')}</span>
      </button>

      <button
        type='button'
        onClick={() => onSelectMode(true)}
        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
          isCameraActive
            ? 'bg-slate-900 text-white shadow-xs'
            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
      >
        <span className='relative flex h-2 w-2'>
          {isCameraActive && (
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75' />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isCameraActive ? 'bg-emerald-400' : 'bg-slate-400'
            }`}
          />
        </span>
        <Camera size={14} className={isCameraActive ? 'text-emerald-400' : 'text-slate-400'} />
        <span className='truncate'>{t('scan.modeCamera')}</span>
      </button>
    </div>
  );
}

