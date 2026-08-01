import { useEffect, useRef, useState } from 'react';
import { Camera, Search, X } from 'lucide-react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { playScanSound } from '../utils/scan-sound';

interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onDetectedBarcode: (barcode: string) => void;
}

export function PosCameraScannerModal({
  open,
  onClose,
  onDetectedBarcode,
}: Props) {
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!open) return;
    const elementId = 'pos-camera-viewfinder';
    let isStopped = false;

    const startScanner = async () => {
      try {
        setCameraError(null);
        const html5QrCode = new Html5Qrcode(elementId, {
          formatsToSupport: [
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
          ],
          verbose: false,
        });

        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 15,
            qrbox: (w, h) => ({
              width: Math.min(w * 0.85, 280),
              height: Math.min(h * 0.65, 180),
            }),
          },
          (decodedText) => {
            if (isStopped) return;
            isStopped = true;
            playScanSound();
            onDetectedBarcode(decodedText);
            onClose();
          },
          () => {}, // Ignore frame decoding failures
        );
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : 'Camera permission denied';
        setCameraError(msg);
      }
    };

    // Small delay to ensure modal DOM is mounted
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
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs'>
      <div className='w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-slate-100 pb-3'>
          <div className='flex items-center gap-2'>
            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600'>
              <Camera size={20} />
            </div>
            <h3 className='font-extrabold text-slate-900 text-base'>
              Scan Barcode
            </h3>
          </div>
          <button
            onClick={onClose}
            className='rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer'
          >
            <X size={20} />
          </button>
        </div>

        {/* Viewfinder Container */}
        <div className='relative flex h-60 w-full items-center justify-center overflow-hidden rounded-2xl bg-black shadow-inner'>
          <div id='pos-camera-viewfinder' className='h-full w-full' />
          {cameraError && (
            <div className='absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 p-4 text-center text-rose-400 text-xs'>
              <p className='font-bold mb-1'>Camera Error</p>
              <p className='text-slate-300'>{cameraError}</p>
            </div>
          )}
        </div>

        {/* Manual Fallback Input */}
        <form onSubmit={handleManualSubmit} className='space-y-2'>
          <label className='block text-xs font-semibold text-slate-600'>
            Or type barcode manually:
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
    </div>
  );
}
