import { Download, Filter, Loader2, Plus, Search } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';

export type StockFilterType = 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

interface Props {
  readonly onSearchChange: (value: string) => void;
  readonly stockFilter: StockFilterType;
  readonly onStockFilterChange: (filter: StockFilterType) => void;
  readonly onAddProduct: () => void;
  readonly onExportCsv?: () => void;
  readonly isExporting?: boolean;
}

export function ProductTableHeader({
  onSearchChange,
  stockFilter,
  onStockFilterChange,
  onAddProduct,
  onExportCsv,
  isExporting = false,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between min-w-0 w-full'>
      {/* Title & Description */}
      <div>
        <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>{t('products.products')}</h1>
        <p className='text-sm text-slate-500'>
          {t('products.searchProduct')}
        </p>
      </div>

      {/* Actions: Stock Filter, Search, Export CSV, & Add Product */}
      <div className='flex flex-wrap items-center gap-2.5 w-full sm:w-auto'>
        {/* Stock Filter Dropdown */}
        <div className='relative flex items-center min-w-36'>
          <Filter size={16} className='absolute left-3 text-slate-400 pointer-events-none' />
          <select
            value={stockFilter}
            onChange={(e) => onStockFilterChange(e.target.value as StockFilterType)}
            className='w-full h-10 rounded-2xl border border-slate-200 bg-white pl-9 pr-8 text-xs font-extrabold text-slate-700 shadow-2xs focus:border-indigo-500 focus:outline-none cursor-pointer appearance-none'
          >
            <option value='ALL'>{t('common.all')}</option>
            <option value='IN_STOCK'>🟢 {t('products.inStock')}</option>
            <option value='LOW_STOCK'>⚠️ {t('pos.lowStock', { qty: '' }).replace('()', '').trim()}</option>
            <option value='OUT_OF_STOCK'>🚨 {t('products.outOfStock')}</option>
          </select>
          <span className='absolute right-3 pointer-events-none text-[10px] text-slate-400'>▼</span>
        </div>

        {/* Search Bar */}
        <div className='relative flex-1 sm:w-48 min-w-0'>
          <Search size={17} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
          <input
            type='text'
            placeholder={t('products.searchProduct')}
            onChange={(e) => onSearchChange(e.target.value)}
            className='w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs'
          />
        </div>

        {/* Export CSV Button */}
        {onExportCsv && (
          <button
            type='button'
            disabled={isExporting}
            onClick={onExportCsv}
            className='flex items-center justify-center gap-1.5 rounded-2xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs sm:text-sm font-extrabold text-emerald-700 shadow-2xs transition hover:bg-emerald-100 disabled:opacity-50 cursor-pointer shrink-0'
          >
            {isExporting ? <Loader2 size={16} className='animate-spin' /> : <Download size={16} />}
            <span>{t('reports.exportExcel')}</span>
          </button>
        )}

        {/* Add Product Button */}
        <button
          type='button'
          onClick={onAddProduct}
          className='flex items-center justify-center gap-1.5 rounded-2xl bg-slate-900 px-4 py-2 text-xs sm:text-sm font-extrabold text-white shadow-md transition hover:bg-slate-800 active:scale-98 cursor-pointer shrink-0'
        >
          <Plus size={17} />
          <span>{t('products.addProduct')}</span>
        </button>
      </div>
    </div>
  );
}
