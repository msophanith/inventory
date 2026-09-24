import { useCallback, useMemo, useState } from 'react';
import {
  BarcodeScanner,
  useTorch,
  type DetectedBarcode,
} from 'react-barcode-scanner';
import { Camera, CameraOff, RefreshCw, Zap, ZapOff } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';
import { BARCODE_FORMATS } from '../../sell/constants/barcode-formats';
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

  const scanOptions = useMemo(
    () => ({ delay: 120, formats: BARCODE_FORMATS }),
    [],
  );

  const handleCapture = useCallback(
    (barcodes: DetectedBarcode[]) => {
      if (!isActive || isSearching) return;
      const match = barcodes.find((b) => b.rawValue?.trim());
      if (match?.rawValue) {
        onDetected(match.rawValue.trim());
      }
    },
    [isActive, isSearching, onDetected],
  );

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    setCameraError(null);
  };

  return (
    <div className='relative w-full overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 shadow-xl'>
      {/* Video Viewport Container */}
      <div className='relative flex h-64 sm:h-72 w-full items-center justify-center overflow-hidden'>
        {isActive ? (
          <BarcodeScanner
            options={scanOptions}
            onCapture={handleCapture}
            onCameraError={(err) => setCameraError(err.message || 'Camera access error')}
            trackConstraints={{ facingMode }}
          />
        ) : (
          <div className='flex flex-col items-center justify-center p-6 text-center text-slate-400'>
            <CameraOff size={40} className='mb-2 text-slate-500 opacity-60' />
            <p className='text-xs font-bold text-slate-300'>{t('scan.scannerPaused')}</p>
          </div>
        )}

        {/* HUD Scanner Target Framing Overlay */}
        {isActive && !cameraError && <ScanCameraReticle />}

        {/* Camera Permission / Device Error Overlay */}
        {cameraError && (
          <div className='absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/95 p-6 text-center backdrop-blur-xs'>
            <CameraOff size={36} className='text-rose-500 mb-2' />
            <p className='text-xs font-bold text-white'>{t('scan.cameraError')}</p>
            <p className='mt-1 text-[11px] text-slate-400 max-w-xs'>{cameraError}</p>
            <button
              type='button'
              onClick={() => setCameraError(null)}
              className='mt-4 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700'
            >
              {t('common.retry') || 'Retry'}
            </button>
          </div>
        )}

        {/* Bottom Floating Control Bar */}
        <div className='absolute bottom-3 inset-x-3 z-10 flex items-center justify-between pointer-events-auto'>
          <button
            type='button'
            onClick={onToggleActive}
            className='flex items-center gap-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-3.5 py-1.5 text-[11px] font-extrabold text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer'
          >
            {isActive ? <CameraOff size={14} /> : <Camera size={14} />}
            <span>{isActive ? t('scan.pauseCamera') : t('scan.startCamera')}</span>
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
