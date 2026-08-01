import { Calendar, Folder, Hash, Info, Layers, Package } from 'lucide-react';
import type { Product } from '../../../services/product';
import { formatDate } from '../../../utils/date';

interface Props {
  readonly product: Product;
}

const ProductInfoCard = ({ product }: Props) => {
  const items = [
    { label: 'Barcode', value: product.barcode || '-', icon: Hash },
    { label: 'Category', value: product.category || 'General', icon: Folder },
    { label: 'Unit', value: product.unit || 'pcs', icon: Package },
    { label: 'Shelf Storage', value: product.shelf || 'N/A', icon: Layers },
    {
      label: 'Created Date',
      value: formatDate(product.createdAt, 'MMM dd, yyyy', '-'),
      icon: Calendar,
    },
    {
      label: 'Last Updated',
      value: formatDate(product.updatedAt, 'MMM dd, yyyy', '-'),
      icon: Calendar,
    },
  ];

  return (
    <div className='rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-4 min-w-0 w-full'>
      <div className='flex items-center gap-2 border-b border-slate-100 pb-3'>
        <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700'>
          <Info size={18} />
        </div>
        <h2 className='font-bold text-slate-900 text-base'>Product Specification</h2>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5'>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className='flex items-center gap-3 rounded-2xl bg-slate-50/80 border border-slate-100 p-3.5'
            >
              <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500 shadow-2xs shrink-0'>
                <Icon size={16} />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-xs text-slate-400 font-medium'>{item.label}</p>
                <p className='text-xs font-bold text-slate-900 truncate'>{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductInfoCard;