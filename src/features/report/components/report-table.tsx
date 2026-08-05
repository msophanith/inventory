import { useMemo, useState } from 'react';
import { ListFilter, Package, Search, X } from 'lucide-react';
import type { Movement } from '../../../services/movement';
import type { ProductReportItem } from '../types/report.types';
import { ReportProductRows } from './report-product-rows';
import { ReportTransactionRows } from './report-transaction-rows';
import { ReportTablePagination } from './report-table-pagination';

interface Props {
  readonly productReports: ProductReportItem[];
  readonly monthlyMovements: Movement[];
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
  readonly loading?: boolean;
}

export function ReportTable({
  productReports,
  monthlyMovements,
  searchQuery,
  onSearchChange,
  loading,
}: Props) {
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'TRANSACTIONS'>('PRODUCTS');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleTabChange = (tab: 'PRODUCTS' | 'TRANSACTIONS') => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleSearchChange = (query: string) => {
    onSearchChange(query);
    setPage(1);
  };

  const filteredMovements = useMemo(() => {
    if (!searchQuery.trim()) return monthlyMovements;
    const q = searchQuery.toLowerCase();
    return monthlyMovements.filter(
      (m) =>
        m.product?.name?.toLowerCase().includes(q) ||
        m.reference?.toLowerCase().includes(q) ||
        m.note?.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q),
    );
  }, [monthlyMovements, searchQuery]);

  const currentList = activeTab === 'PRODUCTS' ? productReports : filteredMovements;
  const totalPages = Math.ceil(currentList.length / pageSize) || 1;
  const paginatedData = currentList.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className='space-y-6 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xs backdrop-blur-md transition-all hover:border-slate-300'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center rounded-2xl bg-slate-100/90 p-1.5 border border-slate-200/50 shadow-inner'>
          <button
            onClick={() => handleTabChange('PRODUCTS')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'PRODUCTS' ? 'bg-white text-emerald-800 shadow-sm shadow-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package size={16} className={activeTab === 'PRODUCTS' ? 'text-emerald-600' : 'text-slate-400'} />
            <span>Product Breakdown ({productReports.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('TRANSACTIONS')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'TRANSACTIONS' ? 'bg-white text-emerald-800 shadow-sm shadow-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListFilter size={16} className={activeTab === 'TRANSACTIONS' ? 'text-emerald-600' : 'text-slate-400'} />
            <span>Transaction Logs ({monthlyMovements.length})</span>
          </button>
        </div>

        <div className='relative w-full sm:w-80 group'>
          <Search size={18} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-emerald-600 transition-colors pointer-events-none' />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder='Search products or logs...'
            className='w-full rounded-2xl border border-slate-200/80 bg-slate-50/60 pl-10 pr-9 py-2.5 text-xs sm:text-sm font-medium text-slate-800 shadow-xs transition-all hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition'
              title='Clear search'
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className='overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs'>
        {activeTab === 'PRODUCTS' ? (
          <table className='w-full border-collapse text-left text-xs sm:text-sm'>
            <thead>
              <tr className='border-b border-slate-200 bg-slate-50/90 text-xs font-black uppercase tracking-wider text-slate-600'>
                <th className='px-6 py-4'>Product Details</th>
                <th className='px-6 py-4'>Buy / Sell Price</th>
                <th className='px-6 py-4 text-center'>Sold / Returned</th>
                <th className='px-6 py-4 text-right'>Total Sales</th>
                <th className='px-6 py-4 text-right'>Total Cost</th>
                <th className='px-6 py-4 text-right'>Net Margin</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              <ReportProductRows data={paginatedData as ProductReportItem[]} loading={loading} />
            </tbody>
          </table>
        ) : (
          <table className='w-full border-collapse text-left text-xs sm:text-sm'>
            <thead>
              <tr className='border-b border-slate-200 bg-slate-50/90 text-xs font-black uppercase tracking-wider text-slate-600'>
                <th className='px-6 py-4'>Date & ID</th>
                <th className='px-6 py-4'>Product</th>
                <th className='px-6 py-4'>Type & Condition</th>
                <th className='px-6 py-4 text-center'>Qty</th>
                <th className='px-6 py-4 text-right'>Effective Sale</th>
                <th className='px-6 py-4 text-right'>Effective Margin</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              <ReportTransactionRows data={paginatedData as Movement[]} loading={loading} />
            </tbody>
          </table>
        )}
      </div>

      <ReportTablePagination
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        currentCount={paginatedData.length}
        totalCount={currentList.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
      />
    </div>
  );
}
