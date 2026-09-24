import { playScanSound } from '../../sell/utils/scan-sound';
import type { Product } from '../../../services/product.types';
import type { ScanHistoryItem, ScanSettings } from '../types';

export const SETTINGS_KEY = 'pos_scan_settings';
export const HISTORY_KEY = 'pos_scan_history';

export const DEFAULT_SETTINGS: ScanSettings = {
  autoRedirect: false,
  sound: true,
  vibrate: true,
  continuous: true,
};

export function loadScanSettings(): ScanSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function loadScanHistory(): ScanHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function triggerScanFeedback(sound: boolean, vibrate: boolean) {
  if (sound) playScanSound();
  if (vibrate && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate([40, 30, 40]);
  }
}

export function createFoundHistoryItem(product: Product, barcode: string): ScanHistoryItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    barcode,
    productName: product.name,
    productId: product.id,
    sellPrice: product.sellPrice,
    category: product.category,
    quantity: product.quantity,
    unit: product.unit,
    imageUrl: product.imageUrl,
    found: true,
    timestamp: new Date().toISOString(),
  };
}

export function createNotFoundHistoryItem(barcode: string): ScanHistoryItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    barcode,
    found: false,
    timestamp: new Date().toISOString(),
  };
}
