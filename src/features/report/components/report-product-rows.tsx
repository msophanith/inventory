import { AlertTriangle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { ProductReportItem } from '../types/report.types';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';

interface Props {
  readonly data: ProductReportItem[];
  readonly loading?: boolean;
}

export function ReportProductRows({ data, loading }: Props) {
  if (loading) {
    return (
      <tr>
        <td colSpan={6} className='p-10 text-center text-slate-400'>
          Loading product report...
        </td>
      </tr>
    );
  }

  if (data.length === 0) {
    return (
      <tr>
        <td colSpan={6} className='p-12 text-center text-slate-500'>
          No product records found for this period.
        </td>
      </tr>
    );
  }

  return data.map((item) => {
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
              {formatCurrencyUsd(item.buyPrice)}
            </span>
          </div>
          <div className='text-xs text-slate-500'>
            Sell:{' '}
            <span className='font-semibold text-slate-800'>
              {formatCurrencyUsd(item.sellPrice)}
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
        <td className='px-6 py-4 text-right'>
          <span className='block font-black text-slate-900'>
            {formatCurrencyUsd(item.totalSales)}
          </span>
          <span className='block text-[10px] font-bold text-indigo-600'>
            {formatCurrencyKhr(item.totalSales)}
          </span>
        </td>

        {/* Total Cost */}
        <td className='px-6 py-4 text-right'>
          <span className='block font-semibold text-slate-700'>
            {formatCurrencyUsd(item.totalCost)}
          </span>
          <span className='block text-[10px] font-medium text-slate-500'>
            {formatCurrencyKhr(item.totalCost)}
          </span>
        </td>

        {/* Net Margin & % */}
        <td className='px-6 py-4 text-right'>
          <div
            className={`font-bold ${isMarginPos ? 'text-emerald-600' : 'text-rose-600'}`}
          >
            {formatCurrencyUsd(item.netMargin)}
          </div>
          <div className='text-xs text-slate-400 font-medium'>
            {item.marginPercentage.toFixed(1)}% margin
          </div>
        </td>
      </tr>
    );
  });
}
