import { useState } from 'react';
import { Barcode, Box, Check, Layers, MapPin, Pencil, Trash2 } from 'lucide-react';
import type { Product } from '../../../services/product';
import { useNavigate } from 'react-router-dom';

interface Props {
  readonly product: Product;
  readonly onDeleteClick: () => void;
}

const ProductHero = ({ product, onDeleteClick }: Props) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopyBarcode = () => {
    if (!product.barcode) return;
    navigator.clipboard.writeText(product.barcode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm min-w-0 w-full'>
      <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
        {/* Product Image & Meta */}
        <div className='flex flex-col sm:flex-row gap-5 items-start sm:items-center min-w-0 flex-1'>
          <div className='h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 flex items-center justify-center shadow-2xs'>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className='h-full w-full object-cover'
              />
            ) : (
              <Box size={40} className='text-slate-400' />
            )}
          </div>

          <div className='space-y-2 min-w-0 flex-1'>
            <h1 className='text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight'>
              {product.name}
            </h1>

            {product.description && (
              <p className='text-sm text-slate-500 line-clamp-2 max-w-xl'>
                {product.description}
              </p>
            )}

            <div className='flex flex-wrap items-center gap-2.5 text-xs font-semibold text-slate-600 pt-1'>
              {product.barcode && (
                <button
                  type='button'
                  onClick={handleCopyBarcode}
                  title='Copy barcode'
                  className='inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1 text-slate-700 hover:bg-slate-200 transition cursor-pointer'
                >
                  {copied ? (
                    <Check size={14} className='text-emerald-600' />
                  ) : (
                    <Barcode size={14} className='text-slate-500' />
                  )}
                  <span className='font-mono'>{product.barcode}</span>
                </button>
              )}

              <span className='inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1 text-indigo-700'>
                <Layers size={14} />
                {product.category || 'General'}
              </span>

              {product.shelf && (
                <span className='inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1 text-amber-800'>
                  <MapPin size={14} />
                  Shelf: {product.shelf}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100'>
          <button
            type='button'
            className='flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer'
            onClick={() => navigate(`/products/edit/${product.id}`)}
          >
            <Pencil size={16} />
            <span>Edit</span>
          </button>

          <button
            type='button'
            onClick={onDeleteClick}
            className='flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-rose-600 shadow-md shadow-rose-500/20 transition cursor-pointer'
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductHero;
