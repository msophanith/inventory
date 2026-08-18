import {
  Box,
  Gauge,
  HistoryIcon,
  QrCode,
  RefreshCcw,
  ShoppingCart,
  type LucideIcon,
} from 'lucide-react';

export interface MenuItem {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly to: string;
  readonly description: string;
  readonly badgeColor: string;
  readonly adminOnly: boolean;
}

export function getBottomBarMenus(t: (key: string) => string): MenuItem[] {
  return [
    {
      icon: Gauge,
      label: t('reports.dashboard'),
      to: '/',
      description: t('reports.dashboard'),
      badgeColor: 'from-indigo-500 to-blue-600',
      adminOnly: true,
    },
    {
      icon: ShoppingCart,
      label: t('pos.cart'),
      to: '/sell',
      description: t('pos.cart'),
      badgeColor: 'from-emerald-500 to-teal-600',
      adminOnly: false,
    },
    {
      icon: Box,
      label: t('products.products'),
      to: '/products',
      description: t('products.products'),
      badgeColor: 'from-blue-500 to-cyan-600',
      adminOnly: true,
    },
    {
      icon: QrCode,
      label: t('pos.scanBarcode'),
      to: '/scan',
      description: t('pos.scanBarcode'),
      badgeColor: 'from-amber-500 to-orange-600',
      adminOnly: false,
    },
  ];
}

export function getDrawerMenus(t: (key: string) => string): MenuItem[] {
  return [
    {
      icon: ShoppingCart,
      label: t('pos.cart'),
      to: '/sell',
      description: t('pos.cartEmptyDesc'),
      badgeColor: 'from-emerald-500 to-teal-600',
      adminOnly: false,
    },
    {
      icon: QrCode,
      label: t('pos.scanBarcode'),
      to: '/scan',
      description: t('pos.scanBarcode'),
      badgeColor: 'from-amber-500 to-orange-600',
      adminOnly: false,
    },
    {
      icon: Gauge,
      label: t('reports.dashboard'),
      to: '/',
      description: t('reports.dashboard'),
      badgeColor: 'from-indigo-500 to-blue-600',
      adminOnly: true,
    },
    {
      icon: Box,
      label: t('products.products'),
      to: '/products',
      description: t('products.products'),
      badgeColor: 'from-blue-500 to-cyan-600',
      adminOnly: true,
    },
    {
      icon: RefreshCcw,
      label: t('movement.stockMovement'),
      to: '/movement',
      description: t('movement.stockMovement'),
      badgeColor: 'from-purple-500 to-indigo-600',
      adminOnly: true,
    },
    {
      icon: HistoryIcon,
      label: t('reports.reports'),
      to: '/report',
      description: t('reports.reports'),
      badgeColor: 'from-rose-500 to-pink-600',
      adminOnly: true,
    },
  ];
}
