import { useCallback, useMemo, useState } from 'react';
import { BarcodeScanner, useTorch, type DetectedBarcode } from 'react-barcode-scanner';
import { CameraOff, RefreshCw, X, Zap, ZapOff } from 'lucide-react';
import { useLanguage } from '@/i18n/language-context';
import { BARCODE_FORMATS } from '@/features/sell/constants/barcode-formats';
import { ScanCameraReticle } from './scan-camera-reticle';

interface Props {
  readonly onDetected: (code: string) => void;
  readonly isSearching: boolean;
  readonly isActive: boolean;
  readonly onToggleActive: () => void;
}

export function ScanCameraViewfinder({
  onDetected,
  isSearching,
  isActive,
  onToggleActive,
}: Props) {
  const { t } = useLanguage();
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { isTorchSupported, isTorchOn, setIsTorchOn } = useTorch();

  const scanOptions = useMemo(() => ({ delay: 120, formats: BARCODE_FORMATS }), []);

  const handleCapture = useCallback(
    (barcodes: DetectedBarcode[]) => {
      if (!isActive || isSearching) return;
      const match = barcodes.find((b) => b.rawValue?.trim());
      if (match?.rawValue) onDetected(match.rawValue.trim());
    },
    [isActive, isSearching, onDetected],
  );

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    setCameraError(null);
  };

  return (
    <div className='relative w-full overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 shadow-xl animate-in fade-in duration-200'>
      <div className='relative flex h-64 sm:h-72 w-full items-center justify-center overflow-hidden'>
        {isActive && (
          <BarcodeScanner
            options={scanOptions}
            onCapture={handleCapture}
            onCameraError={(err) => setCameraError(err.message || 'Camera access error')}
            trackConstraints={{ facingMode }}
          />
        )}

        {isActive && !cameraError && <ScanCameraReticle />}

        {/* Top Overlay: Live Status & Close Action */}
        <div className='absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-auto'>
          <div className='inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-800/80 px-2.5 py-1 text-white shadow-sm'>
            <span className='h-2 w-2 rounded-full bg-emerald-400 animate-pulse' />
            <span className='text-[10px] font-extrabold uppercase tracking-wider'>{t('scan.cameraLive')}</span>
          </div>

          <button
            type='button'
            onClick={onToggleActive}
            className='flex items-center gap-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-rose-950/80 hover:border-rose-700/80 transition active:scale-95 cursor-pointer shadow-sm'
            title={t('scan.closeCamera')}
          >
            <X size={13} />
            <span>{t('scan.closeCamera')}</span>
          </button>
        </div>

        {/* Camera Permission / Error Overlay */}
        {cameraError && (
          <div className='absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/95 p-6 text-center backdrop-blur-xs'>
            <CameraOff size={36} className='text-rose-500 mb-2' />
            <p className='text-xs font-bold text-white'>{t('scan.cameraError')}</p>
            <p className='mt-1 text-[11px] text-slate-400 max-w-xs'>{cameraError}</p>
            <button
              type='button'
              onClick={() => setCameraError(null)}
              className='mt-4 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 cursor-pointer'
            >
              {t('common.retry') || 'Retry'}
            </button>
          </div>
        )}

        {/* Bottom Floating Control Bar */}
        <div className='absolute bottom-3 inset-x-3 z-20 flex items-center justify-between pointer-events-auto'>
          <button
            type='button'
            onClick={onToggleActive}
            className='flex items-center gap-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-3 py-1.5 text-[11px] font-extrabold text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer'
          >
            <CameraOff size={14} />
            <span>{t('scan.closeCamera')}</span>
          </button>

          <div className='flex items-center gap-1.5'>
            {isTorchSupported && isActive && (
              <button
                type='button'
                onClick={() => setIsTorchOn(!isTorchOn)}
                title={isTorchOn ? t('scan.torchOff') : t('scan.torchOn')}
                className={`flex h-8 w-8 items-center justify-center rounded-full border transition active:scale-90 cursor-pointer ${
                  isTorchOn
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/30'
                    : 'bg-slate-900/80 text-white border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                {isTorchOn ? <Zap size={14} className='fill-slate-950' /> : <ZapOff size={14} />}
              </button>
            )}

            {isActive && (
              <button
                type='button'
                onClick={toggleFacingMode}
                title={t('scan.flipCamera')}
                className='flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 border border-slate-700/60 text-white hover:bg-slate-800 transition active:scale-90 cursor-pointer'
              >
                <RefreshCw size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
