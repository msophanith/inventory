import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gooeyToast } from 'goey-toast';
import { useLanguage } from '../../../i18n/language-context';
import { productService } from '../../../services';
import type { Product } from '../../../services/product.types';
import { usePosStore } from '../../sell/store/use-pos-store';
import type { ScanLookupResult, ScanSettings } from '../types';
import {
  createFoundHistoryItem,
  createNotFoundHistoryItem,
  HISTORY_KEY,
  loadScanHistory,
  loadScanSettings,
  SETTINGS_KEY,
  triggerScanFeedback,
} from '../utils/scan-terminal-utils';

export function useScanTerminal() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const lastScannedTimeRef = useRef<number>(0);
  const lastBarcodeRef = useRef<string>('');

  const [settings, setSettings] = useState<ScanSettings>(loadScanSettings);
  const [history, setHistory] = useState(loadScanHistory);
  const [result, setResult] = useState<ScanLookupResult>({
    status: 'idle',
    product: null,
    searchedBarcode: '',
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
  }, [history]);

  const handleScanCode = useCallback(
    async (rawCode: string) => {
      const clean = rawCode.trim();
      const now = Date.now();
      if (!clean || (clean === lastBarcodeRef.current && now - lastScannedTimeRef.current < 1500)) {
        return;
      }

      lastScannedTimeRef.current = now;
      lastBarcodeRef.current = clean;
      setResult({ status: 'searching', product: null, searchedBarcode: clean });

      try {
        const product = await productService.getByBarcodeOrSearch(clean);
        triggerScanFeedback(settings.sound, settings.vibrate);

        if (product) {
          gooeyToast.success(t('scan.foundProduct', { name: product.name }));
          setResult({ status: 'found', product, searchedBarcode: clean });
          setHistory((prev) => [
            createFoundHistoryItem(product, clean),
            ...prev.filter((i) => i.barcode !== clean).slice(0, 29),
          ]);

          if (settings.autoRedirect) {
            setTimeout(() => navigate(`/products/${product.id}`), 900);
          }
        } else {
          gooeyToast.error(t('scan.barcodeNotFound', { barcode: clean }));
          setResult({ status: 'not_found', product: null, searchedBarcode: clean });
          setHistory((prev) => [
            createNotFoundHistoryItem(clean),
            ...prev.filter((i) => i.barcode !== clean).slice(0, 29),
          ]);

          if (settings.autoRedirect) {
            setTimeout(() => navigate(`/products/create?barcode=${encodeURIComponent(clean)}`), 1200);
          }
        }
      } catch (err) {
        console.error('Scan lookup error:', err);
        gooeyToast.error(t('scan.errorQuerying'));
        setResult({ status: 'idle', product: null, searchedBarcode: clean });
      }
    },
    [navigate, settings, t],
  );

  const handleAddToCart = useCallback((product: Product) => {
    if (product.quantity <= 0) {
      gooeyToast.error(t('scan.outOfStock'));
      return;
    }
    usePosStore.getState().addItem(product);
    gooeyToast.success(t('scan.addedToCart', { name: product.name }));
  }, [t]);

  return {
    settings,
    updateSettings: (patch: Partial<ScanSettings>) => setSettings((s) => ({ ...s, ...patch })),
    history,
    clearHistory: () => setHistory([]),
    result,
    resetResult: () => setResult({ status: 'idle', product: null, searchedBarcode: '' }),
    handleScanCode,
    handleAddToCart,
    isSearching: result.status === 'searching',
  };
}
