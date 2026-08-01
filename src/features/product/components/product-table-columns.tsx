import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Package } from 'lucide-react';
import type { Product } from '../../../services/product';

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Product',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className='flex items-center gap-3.5 min-w-[200px]'>
          <div className='h-12 w-12 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shrink-0 flex items-center justify-center'>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className='h-full w-full object-cover'
              />
            ) : (
              <Package className='text-slate-400' size={20} />
            )}
          </div>
          <div className='min-w-0 flex-1'>
            <p className='font-bold text-slate-900 text-sm truncate'>
              {product.name}
            </p>
            <p className='text-xs text-slate-400 font-mono'>{product.barcode || `#${product.id}`}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <span className='rounded-xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 whitespace-nowrap'>
        {row.original.category || 'General'}
      </span>
    ),
  },
  {
    accessorKey: 'quantity',
    header: 'Stock Status',
    cell: ({ row }) => {
      const { quantity, minStock, unit } = row.original;
      let status = 'In Stock';
      let style = 'bg-emerald-100 text-emerald-800';

      if (quantity === 0) {
        status = 'Out of Stock';
        style = 'bg-rose-100 text-rose-800';
      } else if (quantity <= minStock) {
        status = 'Low Stock';
        style = 'bg-amber-100 text-amber-800';
      }

      return (
        <div className='space-y-1 whitespace-nowrap'>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${style}`}>
            {status}
          </span>
          <p className='text-xs text-slate-500 font-medium'>
            {quantity} {unit || 'units'}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'sellPrice',
    header: 'Price',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className='whitespace-nowrap'>
          <p className='font-extrabold text-slate-900 text-sm'>
            ${product.sellPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className='text-[11px] text-slate-400 font-medium'>
            Cost: ${product.buyPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: '',
    cell: () => (
      <button
        type='button'
        className='rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer'
      >
        <MoreHorizontal size={18} />
      </button>
    ),
  },
];
