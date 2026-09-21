import 'react-barcode-scanner/polyfill';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../../../i18n/language-context';
import { Camera, Search, X, Zap, ZapOff } from 'lucide-react';
import {
  BarcodeScannerProvider,
  useTorch,
  type DetectedBarcode,
} from 'react-barcode-scanner';
import { playScanSound } from '../utils/scan-sound';
import { BARCODE_FORMATS } from '../constants/barcode-formats';
import { PosScannerViewfinder } from './pos-scanner-viewfinder';

interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onDetectedBarcode: (barcode: string) => void;
}

function ScannerContent({ onClose, onDetectedBarcode }: Omit<Props, 'open'>) {
  const { t } = useLanguage();
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { isTorchSupported, isTorchOn, setIsTorchOn } = useTorch();
  const isHandledRef = useRef(false);

  const scanOptions = useMemo(
    () => ({ delay: 150, formats: BARCODE_FORMATS }),
    [],
  );

  const handleCapture = useCallback(
    (barcodes: DetectedBarcode[]) => {
      if (isHandledRef.current) return;
      const match = barcodes.find((b) => b.rawValue?.trim());
      if (!match?.rawValue) return;

      isHandledRef.current = true;
      playScanSound();
      onDetectedBarcode(match.rawValue.trim());
      onClose();
    },
    [onClose, onDetectedBarcode],
  );

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      playScanSound();
      onDetectedBarcode(manualCode.trim());
      setManualCode('');
      onClose();
    }
  };

  return (
    <div className='w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white p-4 pb-8 sm:p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200'>
      <div className='flex items-center justify-between border-b border-slate-100 pb-3'>
        <div className='flex items-center gap-2'>
          <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600'>
            <Camera size={20} />
          </div>
          <h3 className='font-extrabold text-slate-900 text-base'>
            {t('pos.scanBarcode')}
          </h3>
        </div>

        <div className='flex items-center gap-2'>
          {isTorchSupported && (
            <button
              type='button'
              onClick={() => setIsTorchOn(!isTorchOn)}
              title={isTorchOn ? 'Turn Flash Off' : 'Turn Flash On'}
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition cursor-pointer ${
                isTorchOn
                  ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isTorchOn ? (
                <Zap size={16} className='fill-slate-950' />
              ) : (
                <ZapOff size={16} />
              )}
            </button>
          )}
          <button
            onClick={onClose}
            className='rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer'
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <PosScannerViewfinder
        scanOptions={scanOptions}
        onCapture={handleCapture}
        onCameraError={(err) =>
          setCameraError(err.message || 'Camera permission denied')
        }
        cameraError={cameraError}
        errorMessage={t('pos.cameraError')}
      />

      <form onSubmit={handleManualSubmit} className='space-y-2'>
        <label className='block text-xs font-semibold text-slate-600'>
          {t('pos.orTypeManually')}
        </label>
        <div className='relative'>
          <input
            type='text'
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder='Enter barcode number...'
            className='w-full rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-10 py-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none'
          />
          <button
            type='submit'
            className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 cursor-pointer'
          >
            <Search size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}

export function PosCameraScannerModal({
  open,
  onClose,
  onDetectedBarcode,
}: Props) {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200'>
      <BarcodeScannerProvider>
        <ScannerContent
          onClose={onClose}
          onDetectedBarcode={onDetectedBarcode}
        />
      </BarcodeScannerProvider>
    </div>
  );
}
