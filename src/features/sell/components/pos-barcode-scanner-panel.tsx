import { useMemo } from 'react';
import { Camera, Radio, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/i18n/language-context';
import type { Product } from '@/services/product';
import type { CartItem } from '@/features/sell/types/sell.types';
import { PosScannerSearchInput } from './pos-scanner-search-input';
import { PosLastScannedCard } from './pos-last-scanned-card';
import { PosScannerEmptyState } from './pos-scanner-empty-state';

interface Props {
  readonly lastScannedProduct: Product | null;
  readonly cartItems: CartItem[];
  readonly isSearching?: boolean;
  readonly isScannerActive?: boolean;
  readonly onScanBarcode: (code: string) => void;
  readonly onSelectProduct: (product: Product) => void;
  readonly onUpdateQty: (productId: string, delta: number) => void;
  readonly onStockExceeded?: (productName: string, maxStock: number) => void;
  readonly onDismissLastScanned: () => void;
  readonly onOpenScanModal: () => void;
}

export function PosBarcodeScannerPanel({
  lastScannedProduct,
  cartItems,
  isSearching,
  isScannerActive = true,
  onScanBarcode,
  onSelectProduct,
  onUpdateQty,
  onStockExceeded,
  onDismissLastScanned,
  onOpenScanModal,
}: Props) {
  const { t } = useLanguage();

  const cartMap = useMemo(() => {
    const map = new Map<string, number>();
    cartItems.forEach((i) => map.set(i.product.id, i.quantity));
    return map;
  }, [cartItems]);

  const totalItemsCount = useMemo(
    () => cartItems.reduce((acc, curr) => acc + curr.quantity, 0),
    [cartItems],
  );

  return (
    <div className='flex-1 min-w-0 w-full space-y-4'>
      {/* Top Status & Controls Header */}
      <div className='flex flex-wrap items-center justify-between gap-2.5 rounded-2xl bg-white p-3.5 border border-slate-200/80 shadow-xs'>
        <div className='flex items-center gap-2'>
          <div className='relative flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600'>
            <Radio size={16} className={isScannerActive ? 'animate-pulse' : ''} />
            {isScannerActive && (
              <span className='absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 animate-ping' />
            )}
          </div>
          <div>
            <p className='text-xs font-black text-slate-800 flex items-center gap-1.5'>
              {t('pos.scannerReady')}
              <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
            </p>
            <p className='text-[10px] font-semibold text-slate-400'>
              {t('pos.scannerListening')}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={onOpenScanModal}
            className='inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 text-xs font-bold transition active:scale-98 cursor-pointer'
          >
            <Camera size={14} />
            <span>{t('pos.cameraScanner')}</span>
          </button>
        </div>
      </div>

      {/* Manual / Barcode Search Input */}
      <PosScannerSearchInput
        onScanBarcode={onScanBarcode}
        onSelectProduct={onSelectProduct}
        isSearching={isSearching}
      />

      {/* Center Hero: Last Scanned Card OR Empty Ready-to-Scan State */}
      {lastScannedProduct ? (
        <PosLastScannedCard
          product={lastScannedProduct}
          cartQuantity={cartMap.get(lastScannedProduct.id) || 0}
          onUpdateQty={onUpdateQty}
          onStockExceeded={onStockExceeded}
          onDismiss={onDismissLastScanned}
        />
      ) : (
        <PosScannerEmptyState onOpenScanModal={onOpenScanModal} />
      )}

      {/* Session Quick Summary Footer */}
      {cartItems.length > 0 && (
        <div className='flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-200/70 p-3 text-xs'>
          <div className='flex items-center gap-2 text-slate-600 font-bold'>
            <ShoppingBag size={14} className='text-emerald-600' />
            <span>{t('pos.itemsCount', { count: totalItemsCount })}</span>
          </div>
          <span className='text-[11px] font-medium text-slate-400'>
            {t('pos.scanToRingUp')}
          </span>
        </div>
      )}
    </div>
  );
}

