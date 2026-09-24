import { Check, Copy, Layers, MapPin, Package, X } from 'lucide-react';
import { useState } from 'react';
import { gooeyToast } from 'goey-toast';
import { useLanguage } from '../../../i18n/language-context';
import type { Product } from '../../../services/product.types';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';
import { ScanProductActions } from './scan-product-actions';

interface Props {
  readonly product: Product;
  readonly onAddToCart: (product: Product) => void;
  readonly onDismiss: () => void;
}

export function ScanProductResult({ product, onAddToCart, onDismiss }: Props) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyBarcode = () => {
    navigator.clipboard?.writeText(product.barcode);
    setCopied(true);
    gooeyToast.success(t('scan.copiedBarcode'));
    setTimeout(() => setCopied(false), 2000);
  };

  const isOutOfStock = product.quantity <= 0;
  const isLowStock = !isOutOfStock && product.quantity <= (product.minStock || 5);

  return (
    <div className='relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xl shadow-slate-900/5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200'>
      {/* Top Meta Bar: Status Pill & Dismiss Button */}
      <div className='flex items-center justify-between'>
        <div className='inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 border border-emerald-200/60'>
          <span className='h-2 w-2 rounded-full bg-emerald-500 animate-pulse' />
          <span className='text-[10px] font-extrabold uppercase tracking-wider'>
            {t('scan.found')}
          </span>
        </div>

        <button
          type='button'
          onClick={onDismiss}
          title={t('scan.dismiss')}
          className='flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer'
        >
          <X size={16} />
        </button>
      </div>

      {/* Main Product Info: Image, Category, Barcode, Name, Price */}
      <div className='flex items-start gap-3.5'>
        <div className='relative flex h-18 w-18 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200/80 overflow-hidden shrink-0 shadow-inner'>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className='h-full w-full object-cover' />
          ) : (
            <Package size={28} className='text-slate-400' />
          )}
        </div>

        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-1.5 flex-wrap'>
            <span className='rounded-lg bg-indigo-50 px-2 py-0.5 text-[10px] font-extrabold text-indigo-700 uppercase tracking-wide'>
              {product.category || 'General'}
            </span>
            <button
              type='button'
              onClick={handleCopyBarcode}
              className='inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer'
            >
              <span>{product.barcode}</span>
              {copied ? <Check size={10} className='text-emerald-600' /> : <Copy size={10} />}
            </button>
          </div>

          <h2 className='mt-1 text-base sm:text-lg font-black text-slate-900 leading-snug line-clamp-2'>
            {product.name}
          </h2>

          {/* Dual Currency Price Display (USD & KHR) */}
          <div className='mt-1 flex items-baseline gap-2 flex-wrap'>
            <span className='text-lg sm:text-xl font-black text-emerald-600'>
              {formatCurrencyUsd(product.sellPrice)}
            </span>
            <span className='text-xs font-bold text-slate-400'>
              ({formatCurrencyKhr(product.sellPrice)})
            </span>
          </div>
        </div>
      </div>

      {/* Stock & Location Specs */}
      <div className='grid grid-cols-2 gap-2 text-xs'>
        <div className='rounded-2xl border border-slate-100 bg-slate-50/70 p-2.5 flex items-center gap-2'>
          <Layers size={16} className='text-slate-400 shrink-0' />
          <div className='min-w-0'>
            <p className='text-[10px] font-semibold text-slate-400 uppercase'>{t('scan.stock')}</p>
            <p className='font-extrabold text-slate-900 truncate'>
              {product.quantity} {product.unit || 'pcs'}{' '}
              <span
                className={`ml-1 text-[10px] font-black uppercase ${
                  isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-emerald-600'
                }`}
              >
                ({isOutOfStock ? t('scan.outOfStock') : isLowStock ? t('scan.lowStock') : t('scan.inStock')})
              </span>
            </p>
          </div>
        </div>

        <div className='rounded-2xl border border-slate-100 bg-slate-50/70 p-2.5 flex items-center gap-2'>
          <MapPin size={16} className='text-slate-400 shrink-0' />
          <div className='min-w-0'>
            <p className='text-[10px] font-semibold text-slate-400 uppercase'>{t('scan.shelf')}</p>
            <p className='font-extrabold text-slate-900 truncate'>{product.shelf || '—'}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <ScanProductActions
        product={product}
        isOutOfStock={isOutOfStock}
        onAddToCart={onAddToCart}
        onDismiss={onDismiss}
      />
    </div>
  );
}
