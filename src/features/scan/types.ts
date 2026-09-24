import type { Product } from '../../services/product';

export interface ScanHistoryItem {
  readonly id: string;
  readonly barcode: string;
  readonly productName?: string;
  readonly productId?: string;
  readonly sellPrice?: number;
  readonly category?: string;
  readonly quantity?: number;
  readonly unit?: string;
  readonly imageUrl?: string;
  readonly found: boolean;
  readonly timestamp: string;
}

export interface ScanSettings {
  readonly autoRedirect: boolean;
  readonly sound: boolean;
  readonly vibrate: boolean;
  readonly continuous: boolean;
}

export type ScanMode = 'camera' | 'manual';

export interface ScanLookupResult {
  readonly status: 'idle' | 'searching' | 'found' | 'not_found';
  readonly product: Product | null;
  readonly searchedBarcode: string;
}
