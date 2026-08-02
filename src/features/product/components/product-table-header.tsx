import { Filter, Plus, Search } from 'lucide-react';

export type StockFilterType = 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

interface Props {
  readonly onSearchChange: (value: string) => void;
  readonly stockFilter: StockFilterType;
  readonly onStockFilterChange: (filter: StockFilterType) => void;
  readonly onAddProduct: () => void;
}

export function ProductTableHeader({
  onSearchChange,
  stockFilter,
  onStockFilterChange,
  onAddProduct,
}: Props) {
  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between min-w-0 w-full'>
      {/* Title & Description */}
      <div>
        <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>Products Catalog</h1>
        <p className='text-sm text-slate-500'>
          Manage inventory, pricing, and stock status filters.
        </p>
      </div>

      {/* Actions: Stock Filter Pills, Search Bar, & Add Product */}
      <div className='flex flex-wrap items-center gap-2.5 w-full sm:w-auto'>
        {/* Stock Filter Dropdown / Pills */}
        <div className='relative flex items-center min-w-36'>
          <Filter size={16} className='absolute left-3 text-slate-400 pointer-events-none' />
          <select
            value={stockFilter}
            onChange={(e) => onStockFilterChange(e.target.value as StockFilterType)}
            className='w-full h-10 rounded-2xl border border-slate-200 bg-white pl-9 pr-8 text-xs font-extrabold text-slate-700 shadow-2xs focus:border-indigo-500 focus:outline-none cursor-pointer appearance-none'
          >
            <option value='ALL'>All Products</option>
            <option value='IN_STOCK'>🟢 In Stock</option>
            <option value='LOW_STOCK'>⚠️ Low Stock</option>
            <option value='OUT_OF_STOCK'>🚨 Out of Stock</option>
          </select>
          <span className='absolute right-3 pointer-events-none text-[10px] text-slate-400'>▼</span>
        </div>

        {/* Search Bar */}
        <div className='relative flex-1 sm:w-56 min-w-0'>
          <Search size={17} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
          <input
            type='text'
            placeholder='Search products...'
            onChange={(e) => onSearchChange(e.target.value)}
            className='w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs'
          />
        </div>

        {/* Add Product Button */}
        <button
          type='button'
          onClick={onAddProduct}
          className='flex items-center justify-center gap-1.5 rounded-2xl bg-slate-900 px-4 py-2 text-xs sm:text-sm font-extrabold text-white shadow-md transition hover:bg-slate-800 active:scale-98 cursor-pointer shrink-0'
        >
          <Plus size={17} />
          <span>Add Product</span>
        </button>
      </div>
    </div>
  );
}
