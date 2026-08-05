import { useState } from 'react';
import { Edit2, Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '../types/sell.types';
import { formatCurrencyUsd } from '../../../utils/currency';

interface Props {
  readonly item: CartItem;
  readonly onUpdateQty: (productId: string, delta: number) => void;
  readonly onSetExactQty: (productId: string, exactQty: number) => void;
  readonly onUpdatePrice: (productId: string, newPrice: number) => void;
  readonly onRemove: (productId: string) => void;
  readonly onStockExceeded?: (productName: string, maxStock: number) => void;
}

export function PosCartItem({
  item,
  onUpdateQty,
  onSetExactQty,
  onUpdatePrice,
  onRemove,
  onStockExceeded,
}: Props) {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [customPrice, setCustomPrice] = useState(item.unitPrice.toString());
  const [prevQuantity, setPrevQuantity] = useState(item.quantity);
  const [qtyInput, setQtyInput] = useState(item.quantity.toString());
  const maxStock = item.product.quantity;

  if (item.quantity !== prevQuantity) {
    setPrevQuantity(item.quantity);
    setQtyInput(item.quantity.toString());
  }

  const handlePriceSubmit = () => {
    const parsed = Number.parseFloat(customPrice);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      onUpdatePrice(item.product.id, parsed);
    }
    setIsEditingPrice(false);
  };

  const handleQtyInputChange = (valStr: string) => {
    setQtyInput(valStr);
    const parsed = Number.parseInt(valStr, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      if (parsed > maxStock) {
        onStockExceeded?.(item.product.name, maxStock);
        setQtyInput(maxStock.toString());
        onSetExactQty(item.product.id, maxStock);
      } else {
        onSetExactQty(item.product.id, parsed);
      }
    }
  };

  const handleIncrement = () => {
    if (item.quantity >= maxStock) {
      onStockExceeded?.(item.product.name, maxStock);
    } else {
      onUpdateQty(item.product.id, 1);
    }
  };

  return (
    <div className='flex items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-2.5 transition hover:bg-slate-100/80'>
      <div className='flex-1 min-w-0'>
        <h4 className='font-bold text-slate-900 text-xs truncate'>{item.product.name}</h4>

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
            <button onClick={handlePriceSubmit} className='text-[10px] font-bold text-emerald-600 cursor-pointer'>
              Save
            </button>
          </div>
        ) : (
          <div className='flex items-center gap-1 text-xs text-slate-500 font-medium'>
            <span>{formatCurrencyUsd(item.unitPrice)} each</span>
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

      <div className='flex items-center gap-1 rounded-xl bg-white border border-slate-200 p-1 shadow-2xs'>
        <button
          type='button'
          onClick={() => onUpdateQty(item.product.id, -1)}
          className='flex h-6 w-6 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer'
        >
          <Minus size={12} />
        </button>
        <input
          type='number'
          min='1'
          max={maxStock}
          value={qtyInput}
          onChange={(e) => handleQtyInputChange(e.target.value)}
          onBlur={() => setQtyInput(item.quantity.toString())}
          className='w-11 text-center text-xs font-black text-slate-900 border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-md py-0.5'
        />
        <button
          type='button'
          onClick={handleIncrement}
          className={`flex h-6 w-6 items-center justify-center rounded-lg transition cursor-pointer ${
            item.quantity >= maxStock ? 'text-slate-300 hover:bg-rose-50 hover:text-rose-500' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Plus size={12} />
        </button>
      </div>

      <div className='flex items-center gap-1 text-right shrink-0'>
        <span className='font-extrabold text-slate-900 text-xs w-14 truncate'>
          {formatCurrencyUsd(item.totalPrice)}
        </span>
        <button
          type='button'
          onClick={() => onRemove(item.product.id)}
          className='flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer'
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
