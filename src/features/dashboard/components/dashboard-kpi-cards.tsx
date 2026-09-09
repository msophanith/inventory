import {
  AlertTriangle,
  DollarSign,
  Package,
  ShoppingBag,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { TodaySaleSummary } from '../../../services/movement';
import { useLanguage } from '../../../i18n/language-context';
import { DashboardKpiCardItem } from './dashboard-kpi-card-item';

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
  const healthyCount = Math.max(0, totalItems - totalAlerts);
  const healthRate =
    totalItems > 0 ? Math.round((healthyCount / totalItems) * 100) : 100;

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {/* 1. Today's Revenue */}
      <DashboardKpiCardItem
        title={t('reports.todaySales')}
        usdAmount={totalSales}
        khrAmount={totalSales}
        subText={`${totalOrders} ${t('reports.totalOrders')}`}
        statusBadge={t('reports.period')}
        icon={ShoppingBag}
        theme='blue'
      />

      {/* 2. Total Inventory Valuation */}
      <DashboardKpiCardItem
        title={t('reports.totalValue')}
        usdAmount={totalValue}
        khrAmount={totalValue}
        subText={`${healthRate}% ${t('reports.healthy')}`}
        icon={DollarSign}
        theme='emerald'
      />

      {/* 3. Product Catalog Overview */}
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

      {/* 4. Restock Priority Alerts */}
      <DashboardKpiCardItem
        title={t('reports.lowStockCount')}
        count={totalAlerts}
        countSuffix={t('reports.items')}
        subText={`${outOfStock} ${t('products.outOfStock')} · ${lowStock} ${t('products.lowStock')}`}
        icon={AlertTriangle}
        theme='rose'
        action={{
          label: t('movement.recordMovement'),
          onClick: () => navigate('/movement'),
        }}
      />
    </div>
  );
}
