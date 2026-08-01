import { Plus, Search } from 'lucide-react';

interface Props {
  readonly onSearchChange: (value: string) => void;
  readonly onAddProduct: () => void;
}

export function ProductTableHeader({ onSearchChange, onAddProduct }: Props) {
  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between min-w-0 w-full'>
      {/* Title & Description */}
      <div>
        <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>Products</h1>
        <p className='text-sm text-slate-500'>
          Manage inventory catalog, pricing, and stock status.
        </p>
      </div>

      {/* Actions: Search & Add Product */}
      <div className='flex flex-wrap items-center gap-3 w-full sm:w-auto'>
        {/* Search Bar */}
        <div className='relative flex-1 sm:w-64 min-w-0'>
          <Search size={18} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
          <input
            type='text'
            placeholder='Search products...'
            onChange={(e) => onSearchChange(e.target.value)}
            className='w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs'
          />
        </div>

        {/* Add Product Button */}
        <button
          type='button'
          onClick={onAddProduct}
          className='flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-extrabold text-white shadow-md transition hover:bg-slate-800 active:scale-98 cursor-pointer shrink-0'
        >
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>
    </div>
  );
}
