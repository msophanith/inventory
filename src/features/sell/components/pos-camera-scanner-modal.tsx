import { useEffect, useRef, useState } from 'react';
import { Camera, Search, X, Zap, ZapOff } from 'lucide-react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { playScanSound } from '../utils/scan-sound';

interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onDetectedBarcode: (barcode: string) => void;
}

const BARCODE_FORMATS = [
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.CODE_93,
  Html5QrcodeSupportedFormats.ITF,
  Html5QrcodeSupportedFormats.CODABAR,
  Html5QrcodeSupportedFormats.DATA_MATRIX,
  Html5QrcodeSupportedFormats.QR_CODE,
];

export function PosCameraScannerModal({ open, onClose, onDetectedBarcode }: Props) {
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isTorchSupported, setIsTorchSupported] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!open) return;
    let isStopped = false;

    const startScanner = async () => {
      try {
        setCameraError(null);
        setIsTorchOn(false);
        setIsTorchSupported(false);

        const html5QrCode = new Html5Qrcode('pos-camera-viewfinder', {
          formatsToSupport: BARCODE_FORMATS,
          verbose: false,
        });

        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 15, qrbox: (w, h) => ({ width: Math.min(w * 0.85, 280), height: Math.min(h * 0.65, 180) }) },
          (decodedText) => {
            if (isStopped) return;
            isStopped = true;
            playScanSound();
            onDetectedBarcode(decodedText);
            onClose();
          },
          () => {},
        );

        try {
          const caps = html5QrCode.getRunningTrackCapabilities();
          if (caps && 'torch' in caps) setIsTorchSupported(true);
        } catch {
          /* ignore */
        }
      } catch (err: unknown) {
        setCameraError(err instanceof Error ? err.message : 'Camera permission denied');
      }
    };

    const timer = setTimeout(startScanner, 100);

    return () => {
      isStopped = true;
      clearTimeout(timer);
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [open, onClose, onDetectedBarcode]);

  const toggleTorch = async () => {
    if (!scannerRef.current || !scannerRef.current.isScanning) return;
    try {
      const nextState = !isTorchOn;
      await scannerRef.current.applyVideoConstraints({ advanced: [{ torch: nextState } as any] });
      setIsTorchOn(nextState);
    } catch (err) {
      console.warn('Failed to toggle flash torch:', err);
    }
  };

  if (!open) return null;

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
    <div className='fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200'>
      <div className='w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white p-4 pb-8 sm:p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200'>
        <div className='flex items-center justify-between border-b border-slate-100 pb-3'>
          <div className='flex items-center gap-2'>
            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600'>
              <Camera size={20} />
            </div>
            <h3 className='font-extrabold text-slate-900 text-base'>Scan Barcode</h3>
          </div>

          <div className='flex items-center gap-2'>
            {isTorchSupported && (
              <button
                type='button'
                onClick={toggleTorch}
                title={isTorchOn ? 'Turn Flash Off' : 'Turn Flash On'}
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition cursor-pointer ${
                  isTorchOn ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isTorchOn ? <Zap size={16} className='fill-slate-950' /> : <ZapOff size={16} />}
              </button>
            )}
            <button onClick={onClose} className='rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer'>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className='relative flex h-60 w-full items-center justify-center overflow-hidden rounded-2xl bg-black shadow-inner'>
          <div id='pos-camera-viewfinder' className='h-full w-full' />
          {cameraError && (
            <div className='absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 p-4 text-center text-rose-400 text-xs'>
              <p className='font-bold mb-1'>Camera Error</p>
              <p className='text-slate-300'>{cameraError}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleManualSubmit} className='space-y-2'>
          <label className='block text-xs font-semibold text-slate-600'>Or type barcode manually:</label>
          <div className='relative'>
            <input
              type='text'
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder='Enter barcode number...'
              className='w-full rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-10 py-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none'
            />
            <button type='submit' className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 cursor-pointer'>
              <Search size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
