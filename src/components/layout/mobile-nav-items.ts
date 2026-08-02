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

export const bottomBarMenus: MenuItem[] = [
  {
    icon: Gauge,
    label: 'Dashboard',
    to: '/',
    description: 'Analytics & metrics',
    badgeColor: 'from-indigo-500 to-blue-600',
    adminOnly: true,
  },
  {
    icon: ShoppingCart,
    label: 'Sell',
    to: '/sell',
    description: 'Process sales & checkout',
    badgeColor: 'from-emerald-500 to-teal-600',
    adminOnly: false,
  },
  {
    icon: Box,
    label: 'Products',
    to: '/products',
    description: 'Manage catalog & stock',
    badgeColor: 'from-blue-500 to-cyan-600',
    adminOnly: true,
  },
  {
    icon: QrCode,
    label: 'Scan',
    to: '/scan',
    description: 'Quick barcode lookup',
    badgeColor: 'from-amber-500 to-orange-600',
    adminOnly: false,
  },
];

export const drawerMenus: MenuItem[] = [
  {
    icon: ShoppingCart,
    label: 'POS / Sell',
    to: '/sell',
    description: 'Process sales & checkout',
    badgeColor: 'from-emerald-500 to-teal-600',
    adminOnly: false,
  },
  {
    icon: QrCode,
    label: 'Scan Lookup',
    to: '/scan',
    description: 'Quick barcode lookup',
    badgeColor: 'from-amber-500 to-orange-600',
    adminOnly: false,
  },
  {
    icon: Gauge,
    label: 'Dashboard',
    to: '/',
    description: 'Analytics & metrics',
    badgeColor: 'from-indigo-500 to-blue-600',
    adminOnly: true,
  },
  {
    icon: Box,
    label: 'Products',
    to: '/products',
    description: 'Manage catalog & stock',
    badgeColor: 'from-blue-500 to-cyan-600',
    adminOnly: true,
  },
  {
    icon: RefreshCcw,
    label: 'Stock Movement',
    to: '/movement',
    description: 'Adjustments & logs',
    badgeColor: 'from-purple-500 to-indigo-600',
    adminOnly: true,
  },
  {
    icon: HistoryIcon,
    label: 'Reports & Stats',
    to: '/report',
    description: 'Sales & profit reports',
    badgeColor: 'from-rose-500 to-pink-600',
    adminOnly: true,
  },
];
