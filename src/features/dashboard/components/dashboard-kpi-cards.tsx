import {
  AlertOctagon,
  AlertTriangle,
  Boxes,
  DollarSign,
  Package,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/language-context';
import { DashboardKpiCardItem } from './dashboard-kpi-card-item';

interface Props {
  readonly totalItems: number;
  readonly lowStock: number;
  readonly outOfStock: number;
  readonly totalValue: number;
}

export function DashboardKpiCards({
  totalItems,
  lowStock,
  outOfStock,
  totalValue,
}: Props) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const totalAlerts = lowStock + outOfStock;
  const healthyCount = Math.max(0, totalItems - totalAlerts);
  const healthRate =
    totalItems > 0 ? Math.round((healthyCount / totalItems) * 100) : 100;

  return (
    <div className='space-y-4'>
      {/* Section Header */}
      <div className='flex items-center justify-between px-1'>
        <div className='flex items-center gap-2.5'>
          <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100'>
            <Boxes size={18} />
          </div>
          <div>
            <h3 className='text-sm sm:text-base font-extrabold text-slate-900'>
              Inventory Health & Valuation
            </h3>
            <p className='text-[11px] text-slate-500 font-medium'>
              Live catalog valuation, SKU ratios, and restock alerts
            </p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {/* 1. Total Inventory Valuation */}
        <DashboardKpiCardItem
          title={t('reports.totalValue')}
          usdAmount={totalValue}
          khrAmount={totalValue}
          subText={`${healthRate}% ${t('reports.healthy')}`}
          icon={DollarSign}
          theme='emerald'
        />

        {/* 2. Product Catalog Overview */}
        <DashboardKpiCardItem
          title={t('products.products')}
          count={totalItems}
          countSuffix='SKUs'
          subText={`${healthyCount} ${t('products.inStock')}`}
          icon={Package}
          theme='indigo'
          action={{
            label: `${t('common.all')} →`,
            onClick: () => navigate('/products'),
          }}
        />

        {/* 3. Low Stock Warnings */}
        <DashboardKpiCardItem
          title={t('products.lowStock')}
          count={lowStock}
          countSuffix={t('reports.items')}
          subText={`${lowStock} nearing threshold`}
          icon={AlertTriangle}
          theme='amber'
          action={{
            label: `${t('common.all')} →`,
            onClick: () => navigate('/products'),
          }}
        />

        {/* 4. Restock Priority Alerts */}
        <DashboardKpiCardItem
          title={t('products.outOfStock')}
          count={outOfStock}
          countSuffix={t('reports.items')}
          subText={`${outOfStock} items with 0 balance`}
          icon={AlertOctagon}
          theme='rose'
          action={{
            label: 'Restock →',
            onClick: () => navigate('/movement'),
          }}
        />
      </div>
    </div>
  );
}

