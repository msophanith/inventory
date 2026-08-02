import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, QrCode, Search } from 'lucide-react';
import { productService } from '../services';
import { useHardwareScanner } from '../features/sell/hooks/use-hardware-scanner';
import { playScanSound } from '../features/sell/utils/scan-sound';
import { PosCameraScannerModal } from '../features/sell/components/pos-camera-scanner-modal';
import Alert from '../components/ui/alert';
import { PageContainer } from '../components/layout/page-container';

const ScanPage = () => {
  const navigate = useNavigate();
  const [manualCode, setManualCode] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const handleScanCode = useCallback(
    async (rawCode: string) => {
      const clean = rawCode.trim();
      if (!clean || isSearching) return;

      setIsSearching(true);
      setAlert({
        type: 'info',
        message: `Searching database for barcode "${clean}"...`,
      });

      try {
        const product = await productService.getByBarcodeOrSearch(clean);
        if (product) {
          playScanSound();
          setAlert({
            type: 'success',
            message: `Found "${product.name}"! Redirecting to product details...`,
          });
          setTimeout(() => {
            navigate(`/products/${product.id}`);
          }, 800);
        } else {
          setAlert({
            type: 'error',
            message: `Product not found for barcode "${clean}". Redirecting to create product...`,
          });
          setTimeout(() => {
            navigate(`/products/create?barcode=${encodeURIComponent(clean)}`);
          }, 1500);
        }
      } catch (err) {
        console.error('Scan error:', err);
        setAlert({ type: 'error', message: 'Error querying database' });
      } finally {
        setIsSearching(false);
      }
    },
    [navigate, isSearching],
  );

  useHardwareScanner({
    enabled: !isCameraOpen && !isSearching,
    onScan: handleScanCode,
  });

  return (
    <PageContainer className='space-y-6 max-w-3xl mx-auto py-4'>
      {alert && (
        <div className='fixed top-4 right-4 z-50 max-w-sm'>
          <Alert
            type={alert.type === 'info' ? 'success' : alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Header Banner */}
      <div className='rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl border border-indigo-500/20 text-center space-y-3'>
        <div className='inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-inner'>
          <QrCode size={28} className='animate-pulse' />
        </div>
        <div>
          <h1 className='text-2xl font-black tracking-wide'>
            Scan Barcode Lookup
          </h1>
          <p className='text-xs sm:text-sm text-slate-300 font-medium mt-1'>
            Scan with phone camera, hardware barcode reader, or type barcode
            manually to look up product.
          </p>
        </div>
      </div>

      {/* Manual Input & Camera Trigger Box */}
      <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScanCode(manualCode);
          }}
          className='flex items-center gap-2'
        >
          <div className='relative flex-1 min-w-0'>
            <Search
              size={18}
              className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
            />
            <input
              type='text'
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder='Enter barcode or product ID manually...'
              className='w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 py-3 text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs'
            />
          </div>
          <button
            type='submit'
            disabled={!manualCode.trim() || isSearching}
            className='rounded-2xl bg-slate-900 px-5 py-3 text-xs font-black text-white shadow-md hover:bg-slate-800 disabled:opacity-50 transition cursor-pointer shrink-0'
          >
            Lookup
          </button>
        </form>

        <div className='relative flex items-center justify-center my-2'>
          <div className='border-t border-slate-200 w-full' />
          <span className='absolute bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest'>
            OR
          </span>
        </div>

        {/* Camera Scan Big Action Button */}
        <button
          type='button'
          onClick={() => setIsCameraOpen(true)}
          className='w-full flex items-center justify-center gap-2.5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 py-4 text-sm font-black text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 transition cursor-pointer active:scale-98'
        >
          <Camera size={20} />
          <span>Open Phone Camera Scanner</span>
        </button>
      </div>

      <PosCameraScannerModal
        open={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onDetectedBarcode={handleScanCode}
      />
    </PageContainer>
  );
};

export { ScanPage };
