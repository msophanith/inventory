import { Camera, Sparkles } from 'lucide-react';
import { useLanguage } from '@/i18n/language-context';

interface Props {
  readonly onStart: () => void;
}

export function ScanCameraLauncher({ onStart }: Props) {
  const { t } = useLanguage();

  return (
    <div className='relative overflow-hidden rounded-3xl border border-slate-200/90 bg-linear-to-r from-white via-indigo-50/20 to-white p-4 sm:p-5 shadow-xs hover:border-indigo-200/90 transition-all'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3.5'>
        <div className='flex items-center gap-3.5 min-w-0'>
          <div className='flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 shrink-0'>
            <Camera size={22} />
          </div>
          <div className='min-w-0'>
            <div className='flex items-center gap-2 flex-wrap'>
              <h3 className='text-xs sm:text-sm font-black text-slate-900'>
                {t('scan.cameraCardTitle')}
              </h3>
              <span className='inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-extrabold text-indigo-700 uppercase tracking-wide border border-indigo-100'>
                <Sparkles size={10} />
                <span>{t('scan.cameraScanner')}</span>
              </span>
            </div>
            <p className='text-[11px] font-medium text-slate-500 mt-0.5 line-clamp-1'>
              {t('scan.cameraCardDesc')}
            </p>
          </div>
        </div>

        <button
          type='button'
          onClick={onStart}
          className='flex items-center justify-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition active:scale-95 cursor-pointer shrink-0 self-stretch sm:self-auto'
        >
          <Camera size={14} />
          <span>{t('scan.openCamera')}</span>
        </button>
      </div>
    </div>
  );
}

