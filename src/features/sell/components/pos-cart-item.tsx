import { useState } from 'react';
import { Edit2, Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '../types/sell.types';

interface Props {
  readonly item: CartItem;
  readonly onUpdateQty: (productId: string, delta: number) => void;
  readonly onUpdatePrice: (productId: string, newPrice: number) => void;
  readonly onRemove: (productId: string) => void;
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

export function PosCartItem({
  item,
  onUpdateQty,
  onUpdatePrice,
  onRemove,
}: Props) {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [customPrice, setCustomPrice] = useState(item.unitPrice.toString());
  const maxStock = item.product.quantity;

  const handlePriceSubmit = () => {
    const parsed = parseFloat(customPrice);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdatePrice(item.product.id, parsed);
    }
    setIsEditingPrice(false);
  };

  return (
    <div className='flex items-center justify-between gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/60 p-3 transition hover:bg-slate-100/80'>
      <div className='flex-1 min-w-0'>
        <h4 className='font-bold text-slate-900 text-xs truncate'>
          {item.product.name}
        </h4>

        {/* Price display / custom price edit input */}
        {isEditingPrice ? (
          <div className='flex items-center gap-1 mt-1'>
            <input
              type='number'
              step='0.01'
              min='0'
              autoFocus
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              onBlur={handlePriceSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handlePriceSubmit()}
              className='w-16 rounded-md border border-emerald-500 bg-white px-1.5 py-0.5 text-xs font-bold text-slate-900 focus:outline-none'
            />
            <button
              onClick={handlePriceSubmit}
              className='text-[10px] font-bold text-emerald-600'
            >
              Save
            </button>
          </div>
        ) : (
          <div className='flex items-center gap-1 text-xs text-slate-500 font-medium'>
            <span>{formatCurrency(item.unitPrice)} each</span>
            <button
              onClick={() => setIsEditingPrice(true)}
              title='Custom Price'
              className='text-slate-400 hover:text-emerald-600 cursor-pointer'
            >
              <Edit2 size={11} />
            </button>
          </div>
        )}
      </div>

      {/* Quantity Stepper */}
      <div className='flex items-center gap-1 rounded-xl bg-white border border-slate-200 p-1 shadow-2xs'>
        <button
          onClick={() => onUpdateQty(item.product.id, -1)}
          className='flex h-6 w-6 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer'
        >
          <Minus size={12} />
        </button>
        <span className='w-4 text-center text-xs font-extrabold text-slate-900'>
          {item.quantity}
        </span>
        <button
          disabled={item.quantity >= maxStock}
          onClick={() => onUpdateQty(item.product.id, 1)}
          className='flex h-6 w-6 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition cursor-pointer'
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Subtotal & Delete */}
      <div className='flex items-center gap-1.5 text-right'>
        <span className='font-extrabold text-slate-900 text-xs w-14'>
          {formatCurrency(item.totalPrice)}
        </span>
        <button
          onClick={() => onRemove(item.product.id)}
          className='flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer'
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
