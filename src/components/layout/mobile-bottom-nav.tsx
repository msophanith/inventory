import { Box, Gauge, HistoryIcon, RefreshCcw, ShoppingCart } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../features/auth/use-auth';

const menus = [
  { icon: Gauge, label: 'Dashboard', to: '/', adminOnly: true },
  { icon: ShoppingCart, label: 'Sell', to: '/sell', adminOnly: false },
  { icon: Box, label: 'Products', to: '/products', adminOnly: true },
  { icon: RefreshCcw, label: 'Movement', to: '/movement', adminOnly: true },
  { icon: HistoryIcon, label: 'Report', to: '/report', adminOnly: true },
];

export default function MobileBottomNav() {
  const { isAdmin } = useAuth();
  const visibleMenus = menus.filter((m) => isAdmin || !m.adminOnly);

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 bg-white/90 backdrop-blur-xl px-2 py-1.5 shadow-lg lg:hidden'>
      <div className={`grid items-center justify-items-center gap-1 ${visibleMenus.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' : 'grid-cols-5'}`}>
        {visibleMenus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.to}
              to={menu.to}
              className={({ isActive }) =>
                `relative flex w-full flex-col items-center justify-center rounded-2xl py-2 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-slate-100/80 text-indigo-600 font-bold shadow-2xs'
                    : 'text-slate-500 font-medium hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={19}
                    className={`transition-transform duration-200 ${
                      isActive ? 'scale-110 text-indigo-600' : 'text-slate-500'
                    }`}
                  />
                  <span
                    className={`mt-1 text-[10px] tracking-tight whitespace-nowrap ${
                      isActive
                        ? 'font-bold text-indigo-600'
                        : 'font-medium text-slate-500'
                    }`}
                  >
                    {menu.label}
                  </span>
                  {isActive && (
                    <span className='absolute -bottom-0.5 h-1 w-4 rounded-full bg-indigo-600' />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
