import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services';
import { useHardwareScanner } from '../features/sell/hooks/use-hardware-scanner';
import { playScanSound } from '../features/sell/utils/scan-sound';
import { PosCameraScannerModal } from '../features/sell/components/pos-camera-scanner-modal';
import Toast from '../components/ui/alert';
import { PageContainer } from '../components/layout/page-container';

import { ScanStatusHeader } from '../features/scan/components/scan-status-header';
import { ScanViewfinder } from '../features/scan/components/scan-viewfinder';
import { ScanHistoryFeed, type ScanHistoryItem } from '../features/scan/components/scan-history-feed';

const ScanPage = () => {
  const navigate = useNavigate();
  const [manualCode, setManualCode] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
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
            message: `Found "${product.name}"! Redirecting...`,
          });

          setHistory((prev) => [
            {
              id: `${Date.now()}`,
              barcode: clean,
              productName: product.name,
              productId: product.id,
              found: true,
              timestamp: new Date(),
            },
            ...prev.slice(0, 19),
          ]);

          setTimeout(() => {
            navigate(`/products/${product.id}`);
          }, 800);
        } else {
          setAlert({
            type: 'error',
            message: `Barcode "${clean}" not found! Redirecting to Create Product...`,
          });

          setHistory((prev) => [
            {
              id: `${Date.now()}`,
              barcode: clean,
              found: false,
              timestamp: new Date(),
            },
            ...prev.slice(0, 19),
          ]);

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

  const isHardwareListening = !isCameraOpen && !isSearching;

  useHardwareScanner({
    enabled: isHardwareListening,
    onScan: handleScanCode,
  });

  return (
    <PageContainer className='space-y-5 max-w-3xl mx-auto py-4 pb-24 lg:pb-6'>
      {alert && (
        <Toast
          type={alert.type === 'info' ? 'info' : alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Header Banner & Live Hardware Scanner Status Badge */}
      <ScanStatusHeader isListening={isHardwareListening} />

      {/* Embedded Viewfinder & Manual Barcode Input Card */}
      <ScanViewfinder
        manualCode={manualCode}
        onManualCodeChange={setManualCode}
        onSubmitLookup={handleScanCode}
        onOpenCamModal={() => setIsCameraOpen(true)}
        isSearching={isSearching}
      />

      {/* Recent Scanned Barcode Audit Feed */}
      <ScanHistoryFeed
        history={history}
        onClearHistory={() => setHistory([])}
      />

      {/* Phone Camera Scanner Modal */}
      <PosCameraScannerModal
        open={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onDetectedBarcode={handleScanCode}
      />
    </PageContainer>
  );
};

export { ScanPage };
