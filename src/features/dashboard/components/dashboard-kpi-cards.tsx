import {
  AlertTriangle,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';
import type { TodaySaleSummary } from '../../../services/movement';
import { useLanguage } from '../../../i18n/language-context';

interface Props {
  readonly totalItems: number;
  readonly lowStock: number;
  readonly outOfStock: number;
  readonly totalValue: number;
  readonly todaySale?: TodaySaleSummary;
}

export function DashboardKpiCards({
  totalItems,
  lowStock,
  outOfStock,
  totalValue,
  todaySale,
}: Props) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const totalSales = todaySale?.totalSales ?? 0;
  const totalOrders = todaySale?.totalOrders ?? 0;

  const totalAlerts = lowStock + outOfStock;

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {/* 1. Inventory Valuation Card */}
      <div className='relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md'>
        <div className='flex items-center justify-between'>
          <span className='text-xs font-bold uppercase tracking-wider text-slate-500'>
            {t('reports.totalValue')}
          </span>
          <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600'>
            <DollarSign size={20} />
          </div>
        </div>
        <div className='mt-3 space-y-0.5'>
          <h3 className='text-2xl font-black text-slate-900 tracking-tight'>
            {formatCurrencyUsd(totalValue)}
          </h3>
          <p className='text-xs font-extrabold text-indigo-600'>
            {formatCurrencyKhr(totalValue)}
          </p>
        </div>
        <div className='mt-3 flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold'>
          <TrendingUp size={13} className='text-emerald-500' />
          <span>{t('reports.analyticsDesc')}</span>
        </div>
      </div>

      {/* 2. Today's Revenue Card */}
      <div className='relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md'>
        <div className='flex items-center justify-between'>
          <span className='text-xs font-bold uppercase tracking-wider text-slate-500'>
            {t('reports.todaySales')}
          </span>
          <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600'>
            <ShoppingBag size={20} />
          </div>
        </div>
        <div className='mt-3 space-y-0.5'>
          <h3 className='text-2xl font-black text-slate-900 tracking-tight'>
            {formatCurrencyUsd(totalSales)}
          </h3>
          <p className='text-xs font-extrabold text-blue-600'>
            {formatCurrencyKhr(totalSales)}
          </p>
        </div>
        <div className='mt-3 flex items-center justify-between text-[11px] font-bold'>
          <span className='text-slate-500'>{totalOrders} {t('reports.totalOrders')}</span>
          <span className='rounded-full bg-blue-100 px-2 py-0.5 text-blue-700'>{t('common.status')}</span>
        </div>
      </div>

      {/* 3. Total Products Catalog */}
      <div className='relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md'>
        <div className='flex items-center justify-between'>
          <span className='text-xs font-bold uppercase tracking-wider text-slate-500'>
            {t('products.products')}
          </span>
          <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600'>
            <Package size={20} />
          </div>
        </div>
        <div className='mt-3 space-y-0.5'>
          <h3 className='text-2xl font-black text-slate-900 tracking-tight'>
            {totalItems} <span className='text-sm font-bold text-slate-400'>{t('pos.itemsCount', { count: totalItems })}</span>
          </h3>
          <p className='text-xs font-extrabold text-emerald-600'>
            {Math.max(0, totalItems - totalAlerts)} {t('products.inStock')}
          </p>
        </div>
        <div className='mt-3 flex items-center justify-between text-[11px] font-semibold text-slate-400'>
          <span>{t('products.products')}</span>
          <button
            type='button'
            onClick={() => navigate('/products')}
            className='text-indigo-600 font-bold hover:underline cursor-pointer'
          >
            {t('common.all')} →
          </button>
        </div>
      </div>

      {/* 4. Critical Stock Restock Alerts */}
      <div className='relative overflow-hidden rounded-3xl border border-rose-200/80 bg-rose-50/40 p-5 shadow-sm transition hover:shadow-md'>
        <div className='flex items-center justify-between'>
          <span className='text-xs font-bold uppercase tracking-wider text-rose-700'>
            {t('reports.lowStockCount')}
          </span>
          <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-600'>
            <AlertTriangle size={20} />
          </div>
        </div>
        <div className='mt-3 space-y-0.5'>
          <h3 className='text-2xl font-black text-rose-900 tracking-tight'>
            {totalAlerts}
          </h3>
          <p className='text-xs font-extrabold text-rose-600'>
            {outOfStock} {t('products.outOfStock')} • {lowStock} {t('reports.lowStockCount')}
          </p>
        </div>
        <div className='mt-3 flex items-center justify-between text-[11px] font-bold'>
          <span className='text-rose-700'>{t('reports.lowStockCount')}</span>
          <button
            type='button'
            onClick={() => navigate('/products')}
            className='rounded-full bg-rose-600 px-2.5 py-0.5 text-white hover:bg-rose-700 transition cursor-pointer'
          >
            {t('movement.recordMovement')}
          </button>
        </div>
      </div>
    </div>
  );
}
