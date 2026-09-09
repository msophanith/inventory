import {
  Box,
  Gauge,
  HistoryIcon,
  QrCode,
  RefreshCcw,
  ShoppingCart,
  type LucideIcon,
} from 'lucide-react';

export interface SidebarMenuItem {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly to: string;
  readonly shortcut: string;
  readonly adminOnly: boolean;
}

export function getSidebarMenus(t: (key: string) => string): SidebarMenuItem[] {
  return [
    {
      icon: Gauge,
      label: t('reports.dashboard'),
      to: '/',
      shortcut: 'D',
      adminOnly: true,
    },
    {
      icon: ShoppingCart,
      label: t('pos.cart'),
      to: '/sell',
      shortcut: 'S',
      adminOnly: false,
    },
    {
      icon: QrCode,
      label: t('pos.scanBarcode'),
      to: '/scan',
      shortcut: 'C',
      adminOnly: false,
    },
    {
      icon: Box,
      label: t('products.products'),
      to: '/products',
      shortcut: 'P',
      adminOnly: true,
    },
    {
      icon: RefreshCcw,
      label: t('movement.stockMovement'),
      to: '/movement',
      shortcut: 'M',
      adminOnly: true,
    },
    {
      icon: HistoryIcon,
      label: t('reports.reports'),
      to: '/report',
      shortcut: 'R',
      adminOnly: true,
    },
  ];
}
