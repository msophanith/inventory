import { useEffect, useRef, useState } from 'react';
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
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const visibleMenus = menus.filter((m) => isAdmin || !m.adminOnly);

  useEffect(() => {
    const handleScroll = (currentScrollY: number) => {
      if (currentScrollY > lastScrollY.current && currentScrollY > 30) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    const mainEl = document.querySelector('main');
    const onMainScroll = () => mainEl && handleScroll(mainEl.scrollTop);
    const onWinScroll = () => handleScroll(window.scrollY);

    mainEl?.addEventListener('scroll', onMainScroll, { passive: true });
    window.addEventListener('scroll', onWinScroll, { passive: true });

    return () => {
      mainEl?.removeEventListener('scroll', onMainScroll);
      window.removeEventListener('scroll', onWinScroll);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-3 left-3 right-3 z-50 transition-all duration-300 ease-out lg:hidden ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
      }`}
    >
      <nav className='mx-auto max-w-md rounded-3xl border border-white/70 bg-white/80 p-1.5 shadow-2xl shadow-slate-900/15 backdrop-blur-2xl ring-1 ring-slate-900/5'>
        <div className={`grid items-center justify-items-center gap-1 ${visibleMenus.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' : 'grid-cols-5'}`}>
          {visibleMenus.map((menu) => {
            const Icon = menu.icon;

            return (
              <NavLink
                key={menu.to}
                to={menu.to}
                className={({ isActive }) =>
                  `group relative flex w-full flex-col items-center justify-center rounded-2xl py-2 transition-all duration-200 active:scale-95 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 text-white font-extrabold shadow-md shadow-indigo-500/25 scale-102'
                      : 'text-slate-500 font-semibold hover:text-slate-900 hover:bg-slate-100/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={`transition-transform duration-200 ${
                        isActive ? 'scale-110 text-white' : 'text-slate-500 group-hover:scale-105'
                      }`}
                    />
                    <span
                      className={`mt-1 text-[10px] tracking-tight whitespace-nowrap ${
                        isActive ? 'font-black text-white' : 'font-semibold text-slate-500'
                      }`}
                    >
                      {menu.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
