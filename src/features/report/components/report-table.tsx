import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Package,
  Search,
} from 'lucide-react';
import type { Movement } from '../../../services/movement';
import type { ProductReportItem } from '../types/report.types';
import { calculateMovementItem } from '../utils/report-calculator';
import { formatDateTime } from '../../../utils/date';

interface Props {
  readonly productReports: ProductReportItem[];
  readonly monthlyMovements: Movement[];
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
  readonly loading?: boolean;
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export function ReportTable({
  productReports,
  monthlyMovements,
  searchQuery,
  onSearchChange,
  loading,
}: Props) {
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'TRANSACTIONS'>(
    'PRODUCTS',
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page on search or tab change
  const handleTabChange = (tab: 'PRODUCTS' | 'TRANSACTIONS') => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleSearchChange = (query: string) => {
    onSearchChange(query);
    setPage(1);
  };

  // Filtered transactions if searchQuery is entered
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

  // Paginated Data
  const currentList =
    activeTab === 'PRODUCTS' ? productReports : filteredMovements;
  const totalPages = Math.ceil(currentList.length / pageSize) || 1;
  const paginatedData = currentList.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  // Helper to render product report table body
  const renderProductTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={6} className='p-10 text-center text-slate-400'>
            Loading product report...
          </td>
        </tr>
      );
    }

    if (paginatedData.length === 0) {
      return (
        <tr>
          <td colSpan={6} className='p-12 text-center text-slate-500'>
            No product records found for this period.
          </td>
        </tr>
      );
    }

    return (paginatedData as ProductReportItem[]).map((item) => {
      const isMarginPos = item.netMargin >= 0;
      return (
        <tr key={item.productId} className='transition hover:bg-slate-50/70'>
          {/* Product Name & Category */}
          <td className='px-6 py-4'>
            <p className='font-bold text-slate-900'>{item.productName}</p>
            <span className='inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 font-medium'>
              {item.category}
            </span>
          </td>

          {/* Buy / Sell Price */}
          <td className='px-6 py-4 text-slate-700'>
            <div className='text-xs text-slate-500'>
              Buy:{' '}
              <span className='font-semibold text-slate-800'>
                {formatCurrency(item.buyPrice)}
              </span>
            </div>
            <div className='text-xs text-slate-500'>
              Sell:{' '}
              <span className='font-semibold text-slate-800'>
                {formatCurrency(item.sellPrice)}
              </span>
            </div>
          </td>

          {/* Quantity Stats */}
          <td className='px-6 py-4 text-center'>
            <div className='flex items-center justify-center gap-2'>
              <span className='inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700'>
                <ArrowUpRight size={12} /> {item.quantitySold} Sold
              </span>
              {item.quantityReturned > 0 && (
                <span className='inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700'>
                  <ArrowDownLeft size={12} /> {item.quantityReturned} Ret
                </span>
              )}
              {item.quantityDamaged > 0 && (
                <span className='inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700'>
                  <AlertTriangle size={12} /> {item.quantityDamaged} Damaged
                </span>
              )}
            </div>
          </td>

          {/* Total Sales */}
          <td className='px-6 py-4 text-right font-semibold text-slate-900'>
            {formatCurrency(item.totalSales)}
          </td>

          {/* Total Cost */}
          <td className='px-6 py-4 text-right text-slate-600'>
            {formatCurrency(item.totalCost)}
          </td>

          {/* Net Margin & % */}
          <td className='px-6 py-4 text-right'>
            <div
              className={`font-bold ${isMarginPos ? 'text-emerald-600' : 'text-rose-600'}`}
            >
              {formatCurrency(item.netMargin)}
            </div>
            <div className='text-xs text-slate-400 font-medium'>
              {item.marginPercentage.toFixed(1)}% margin
            </div>
          </td>
        </tr>
      );
    });
  };

  // Helper to render transaction movements table body
  const renderTransactionTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={6} className='p-10 text-center text-slate-400'>
            Loading transactions...
          </td>
        </tr>
      );
    }

    if (paginatedData.length === 0) {
      return (
        <tr>
          <td colSpan={6} className='p-12 text-center text-slate-500'>
            No transaction logs found for this period.
          </td>
        </tr>
      );
    }

    return (paginatedData as Movement[]).map((rawItem) => {
      const calc = calculateMovementItem(rawItem);
      const isDamaged = Boolean(
        rawItem.isDamaged || rawItem.reference?.toLowerCase() === 'damage',
      );
      const dateFormatted = formatDateTime(rawItem.createdAt);

      const typeBadgeClass =
        rawItem.type === 'OUT'
          ? 'bg-orange-100 text-orange-700'
          : rawItem.type === 'RETURN'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-blue-100 text-blue-700';

      return (
        <tr key={rawItem.id} className='transition hover:bg-slate-50/70'>
          {/* Date & ID */}
          <td className='px-6 py-4'>
            <p className='font-semibold text-slate-800'>{dateFormatted}</p>
            <p className='text-xs text-slate-400 font-mono'>
              #{rawItem.id.slice(0, 8)}
            </p>
          </td>

          {/* Product */}
          <td className='px-6 py-4'>
            <p className='font-bold text-slate-900'>
              {rawItem.product?.name || rawItem.productId}
            </p>
            <p className='text-xs text-slate-500'>
              Buy: ${rawItem.product?.buyPrice ?? 0} | Sell: $
              {rawItem.unitPrice ?? rawItem.product?.sellPrice ?? 0}
            </p>
          </td>

          {/* Type & Condition */}
          <td className='px-6 py-4'>
            <div className='flex items-center gap-2'>
              <span
                className={`rounded-xl px-2.5 py-1 text-xs font-bold ${typeBadgeClass}`}
              >
                {rawItem.type}
              </span>
              {isDamaged ? (
                <span className='rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700'>
                  Damaged
                </span>
              ) : (
                <span className='rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700'>
                  Good
                </span>
              )}
            </div>
          </td>

          {/* Quantity */}
          <td className='px-6 py-4 text-center font-bold text-slate-800'>
            {rawItem.quantity}
          </td>

          {/* Effective Sale */}
          <td
            className={`px-6 py-4 text-right font-bold ${calc.effectiveSaleAmount < 0 ? 'text-rose-600' : 'text-slate-900'}`}
          >
            {formatCurrency(calc.effectiveSaleAmount)}
          </td>

          {/* Effective Margin */}
          <td
            className={`px-6 py-4 text-right font-bold ${calc.effectiveMarginAmount < 0 ? 'text-rose-600' : 'text-emerald-600'}`}
          >
            {formatCurrency(calc.effectiveMarginAmount)}
          </td>
        </tr>
      );
    });
  };

  return (
    <div className='space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm'>
      {/* Table Header: Tabs & Search */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        {/* Tabs */}
        <div className='flex items-center rounded-2xl bg-slate-100 p-1'>
          <button
            onClick={() => handleTabChange('PRODUCTS')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition cursor-pointer ${
              activeTab === 'PRODUCTS'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package size={16} />
            <span>Product Breakdown ({productReports.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('TRANSACTIONS')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition cursor-pointer ${
              activeTab === 'TRANSACTIONS'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListFilter size={16} />
            <span>Transaction Logs ({monthlyMovements.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className='relative w-full sm:w-72'>
          <Search
            size={18}
            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
          />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder='Search products or logs...'
            className='w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
          />
        </div>
      </div>

      {/* Table View */}
      <div className='overflow-x-auto rounded-2xl border border-slate-100'>
        {activeTab === 'PRODUCTS' ? (
          /* TAB 1: Product Summary Table */
          <table className='w-full border-collapse text-left text-sm'>
            <thead>
              <tr className='border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500'>
                <th className='px-6 py-4'>Product Details</th>
                <th className='px-6 py-4'>Buy / Sell Price</th>
                <th className='px-6 py-4 text-center'>Sold / Returned</th>
                <th className='px-6 py-4 text-right'>Total Sales</th>
                <th className='px-6 py-4 text-right'>Total Cost</th>
                <th className='px-6 py-4 text-right'>Net Margin</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {renderProductTableBody()}
            </tbody>
          </table>
        ) : (
          /* TAB 2: Movement Transactions Table */
          <table className='w-full border-collapse text-left text-sm'>
            <thead>
              <tr className='border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500'>
                <th className='px-6 py-4'>Date & ID</th>
                <th className='px-6 py-4'>Product</th>
                <th className='px-6 py-4'>Type & Condition</th>
                <th className='px-6 py-4 text-center'>Qty</th>
                <th className='px-6 py-4 text-right'>Effective Sale</th>
                <th className='px-6 py-4 text-right'>Effective Margin</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {renderTransactionTableBody()}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2'>
        <div className='text-sm text-slate-500 font-medium'>
          Showing {paginatedData.length} of {currentList.length} items
        </div>

        <div className='flex items-center gap-3'>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className='rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 cursor-pointer focus:outline-none'
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>

          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className='rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer'
          >
            <ChevronLeft size={18} />
          </button>

          <span className='text-sm font-semibold text-slate-700'>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className='rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer'
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
