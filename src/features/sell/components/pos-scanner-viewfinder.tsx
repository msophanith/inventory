import { CameraOff } from 'lucide-react';
import { BarcodeScanner, type DetectedBarcode, type ScanOptions } from 'react-barcode-scanner';

interface Props {
  readonly scanOptions: ScanOptions;
  readonly onCapture: (barcodes: DetectedBarcode[]) => void;
  readonly onCameraError: (err: Error) => void;
  readonly cameraError: string | null;
  readonly errorMessage: string;
}

export function PosScannerViewfinder({
  scanOptions,
  onCapture,
  onCameraError,
  cameraError,
  errorMessage,
}: Props) {
  return (
    <div className='relative flex h-60 w-full items-center justify-center overflow-hidden rounded-2xl bg-black shadow-inner'>
      <BarcodeScanner
        options={scanOptions}
        onCapture={onCapture}
        onCameraError={onCameraError}
      />
      <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
        <div className='h-36 w-64 rounded-xl border-2 border-emerald-400/70 shadow-[0_0_15px_rgba(52,211,153,0.3)]'>
          <div className='h-0.5 w-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse' />
        </div>
      </div>

      {cameraError && (
        <div className='absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm z-10'>
          <CameraOff size={48} className='text-rose-500 mb-4 opacity-80' />
          <p className='font-bold mb-1 text-white'>{errorMessage}</p>
          <p className='text-xs text-slate-400 max-w-xs'>{cameraError}</p>
        </div>
      )}
    </div>
  );
}
