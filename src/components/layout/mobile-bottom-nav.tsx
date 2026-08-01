import { Box, Gauge, HistoryIcon, ShoppingCart } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const menus = [
  { icon: Gauge, label: 'Dashboard', to: '/' },
  { icon: ShoppingCart, label: 'Sell', to: '/sell' },
  { icon: Box, label: 'Products', to: '/products' },
  { icon: HistoryIcon, label: 'Report', to: '/report' },
];

export default function MobileBottomNav() {
  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-lg lg:hidden'>
      <div className='flex overflow-x-auto scrollbar-hide'>
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.to}
              to={menu.to}
              className={({ isActive }) =>
                `flex min-w-[80px] flex-col items-center justify-center py-3 transition ${
                  isActive ? 'text-indigo-600' : 'text-slate-500'
                }`
              }
            >
              <Icon size={20} />

              <span className='mt-1 text-[11px] whitespace-nowrap'>
                {menu.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
