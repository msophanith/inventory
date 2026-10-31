import { useState } from 'react';
import { BarcodeScannerProvider } from 'react-barcode-scanner';
import { PageMeta } from '@/components/seo/page-meta';
import { PageContainer } from '@/components/layout/page-container';
import { useHardwareScanner } from '@/features/sell/hooks/use-hardware-scanner';
import { useScanTerminal } from '@/features/scan/hooks/use-scan-terminal';
import {
  ScanCameraLauncher,
  ScanCameraViewfinder,
  ScanHeader,
  ScanHistoryList,
  ScanManualBar,
  ScanModeSelector,
  ScanNotFoundResult,
  ScanProductResult,
  ScanSettingsModal,
} from '@/features/scan/components';

export function ScanPage() {
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

  // Camera is OFF by default unless user opted into autoStartCamera in settings
  const [isCameraActive, setIsCameraActive] = useState<boolean>(
    Boolean(settings.autoStartCamera),
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isHardwareListening = !isSettingsOpen && !isSearching;

  useHardwareScanner({
    enabled: isHardwareListening,
    onScan: handleScanCode,
  });

  const handleCameraDetected = (code: string) => {
    handleScanCode(code);
    if (!settings.continuous) {
      setIsCameraActive(false);
    }
  };

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

        {/* Scan Mode Segmented Switcher */}
        <ScanModeSelector
          isCameraActive={isCameraActive}
          onSelectMode={(active) => setIsCameraActive(active)}
        />

        {/* Camera Viewfinder (when active) OR Clean Launcher Card (when inactive) */}
        {isCameraActive ? (
          <ScanCameraViewfinder
            onDetected={handleCameraDetected}
            isSearching={isSearching}
            isActive={isCameraActive}
            onToggleActive={() => setIsCameraActive(false)}
          />
        ) : (
          <ScanCameraLauncher onStart={() => setIsCameraActive(true)} />
        )}

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
