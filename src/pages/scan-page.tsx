import { useState } from 'react';
import { BarcodeScannerProvider } from 'react-barcode-scanner';
import { PageMeta } from '../components/seo/page-meta';
import { PageContainer } from '../components/layout/page-container';
import { useHardwareScanner } from '../features/sell/hooks/use-hardware-scanner';
import { useScanTerminal } from '../features/scan/hooks/use-scan-terminal';
import {
  ScanCameraViewfinder,
  ScanHeader,
  ScanHistoryList,
  ScanManualBar,
  ScanNotFoundResult,
  ScanProductResult,
  ScanSettingsModal,
} from '../features/scan/components';

export function ScanPage() {
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    settings,
    updateSettings,
    history,
    clearHistory,
    result,
    resetResult,
    handleScanCode,
    handleAddToCart,
    isSearching,
  } = useScanTerminal();

  const isHardwareListening = !isSettingsOpen && !isSearching;

  useHardwareScanner({
    enabled: isHardwareListening,
    onScan: handleScanCode,
  });

  return (
    <BarcodeScannerProvider>
      <PageContainer className='space-y-4 max-w-xl mx-auto py-3 px-3 sm:px-4 pb-28 lg:pb-8'>
        <PageMeta
          title='Barcode Scanner & Lookup'
          description='Fast mobile barcode scanner and hardware gun lookup terminal.'
        />

        {/* Top Header & Live Status */}
        <ScanHeader
          isListening={isHardwareListening}
          onOpenSettings={() => setIsSettingsOpen(true)}
          autoRedirect={settings.autoRedirect}
        />

        {/* Embedded Live Camera Scanner */}
        <ScanCameraViewfinder
          onDetected={handleScanCode}
          isSearching={isSearching}
          isActive={isCameraActive}
          onToggleActive={() => setIsCameraActive((prev) => !prev)}
        />

        {/* Manual Barcode Input Bar */}
        <ScanManualBar
          onSearch={handleScanCode}
          isSearching={isSearching}
        />

        {/* Scanned Product Result Card */}
        {result.status === 'found' && result.product && (
          <ScanProductResult
            product={result.product}
            onAddToCart={handleAddToCart}
            onDismiss={resetResult}
          />
        )}

        {/* Scanned Barcode Not Found Card */}
        {result.status === 'not_found' && (
          <ScanNotFoundResult
            barcode={result.searchedBarcode}
            onDismiss={resetResult}
          />
        )}

        {/* Audit Session History Feed */}
        <ScanHistoryList
          history={history}
          onClearHistory={clearHistory}
          onSelectBarcode={handleScanCode}
        />

        {/* Preferences & Settings Modal */}
        <ScanSettingsModal
          open={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSettings={updateSettings}
        />
      </PageContainer>
    </BarcodeScannerProvider>
  );
}

export default ScanPage;
