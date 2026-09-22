import { Download, Loader2, Plus, Search, X } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';

export type StockFilterType = 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

interface Props {
  readonly searchValue: string;
  readonly onSearchChange: (value: string) => void;
  readonly stockFilter: StockFilterType;
  readonly onStockFilterChange: (filter: StockFilterType) => void;
  readonly onAddProduct: () => void;
  readonly onExportCsv?: () => void;
  readonly isExporting?: boolean;
}

export function ProductTableHeader({
  searchValue,
  onSearchChange,
  stockFilter,
  onStockFilterChange,
  onAddProduct,
  onExportCsv,
  isExporting = false,
}: Props) {
  const { t } = useLanguage();

  const filterOptions: { id: StockFilterType; label: string; icon?: string }[] = [
    { id: 'ALL', label: t('common.all') },
    { id: 'IN_STOCK', label: t('products.inStock'), icon: '🟢' },
    { id: 'LOW_STOCK', label: t('products.lowStock'), icon: '⚠️' },
    { id: 'OUT_OF_STOCK', label: t('products.outOfStock'), icon: '🚨' },
  ];

  return (
    <div className='flex flex-col gap-4 min-w-0 w-full'>
      {/* Row 1: Title & Primary Actions */}
      <div className='flex flex-wrap items-center justify-between gap-3 min-w-0 w-full'>
        <div className='min-w-0'>
          <h1 className='text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate'>
            {t('products.products')}
          </h1>
          <p className='text-xs sm:text-sm text-slate-500 font-medium truncate'>
            {t('products.productInformation')}
          </p>
        </div>

        {/* Primary Actions: Export CSV & Add Product */}
        <div className='flex items-center gap-2 shrink-0'>
          {onExportCsv && (
            <button
              type='button'
              disabled={isExporting}
              onClick={onExportCsv}
              title={t('reports.exportExcel')}
              className='flex items-center justify-center gap-1.5 rounded-2xl border border-emerald-300 bg-emerald-50 px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-extrabold text-emerald-700 shadow-2xs transition hover:bg-emerald-100 active:scale-98 disabled:opacity-50 cursor-pointer shrink-0'
            >
              {isExporting ? <Loader2 size={16} className='animate-spin' /> : <Download size={16} />}
              <span className='hidden sm:inline'>{t('reports.exportExcel')}</span>
            </button>
          )}

          <button
            type='button'
            onClick={onAddProduct}
            className='flex items-center justify-center gap-1.5 rounded-2xl bg-slate-900 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-extrabold text-white shadow-md transition hover:bg-slate-800 active:scale-98 cursor-pointer shrink-0'
          >
            <Plus size={17} />
            <span className='whitespace-nowrap'>{t('products.addProduct')}</span>
          </button>
        </div>
      </div>

      {/* Row 2: Search Input & Stock Filter Pills */}
      <div className='flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between min-w-0 w-full'>
        {/* Full-width Responsive Search Bar */}
        <div className='relative flex-1 min-w-0 w-full sm:max-w-md'>
          <Search
            size={17}
            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none'
          />
          <input
            type='text'
            placeholder={t('products.searchProduct')}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className='w-full h-10 rounded-2xl border border-slate-200 bg-white pl-10 pr-9 text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs transition placeholder:text-slate-400'
          />
          {searchValue && (
            <button
              type='button'
              onClick={() => onSearchChange('')}
              className='absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer'
              title='Clear'
              aria-label='Clear search query'
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Touch-friendly Horizontal Scrollable Stock Filter Pills */}
        <div className='flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide shrink-0'>
          {filterOptions.map((item) => (
            <button
              key={item.id}
              type='button'
              onClick={() => onStockFilterChange(item.id)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-extrabold whitespace-nowrap transition-all active:scale-98 cursor-pointer ${
                stockFilter === item.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.icon && <span className='text-[11px]'>{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
