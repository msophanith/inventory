import { useState } from 'react';
import { Grid } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/use-auth';
import { ShortcutsModal } from './shortcuts-modal';
import { MobileNavDrawer } from './mobile-nav-drawer';
import { bottomBarMenus, drawerMenus } from './mobile-nav-items';
import { useMobileNavScroll } from './use-mobile-nav-scroll';

export default function MobileBottomNav() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  const isVisible = useMobileNavScroll(isDrawerOpen);

  const visibleBottomMenus = bottomBarMenus.filter(
    (m) => isAdmin || !m.adminOnly,
  );
  const visibleDrawerMenus = drawerMenus.filter((m) => isAdmin || !m.adminOnly);

  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setIsDrawerOpen(false);
  }

  return (
    <>
      <MobileNavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        menus={visibleDrawerMenus}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
      />

      <div
        className={`fixed bottom-3 left-3 right-3 z-40 transition-all duration-300 ease-out lg:hidden ${
          isVisible || isDrawerOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-24 opacity-0 pointer-events-none'
        }`}
      >
        <nav className='mx-auto max-w-md rounded-3xl border border-white/70 bg-white/85 p-1.5 shadow-2xl shadow-slate-900/15 backdrop-blur-2xl ring-1 ring-slate-900/5'>
          <div
            className='grid items-center justify-items-center gap-1'
            style={{
              gridTemplateColumns: `repeat(${visibleBottomMenus.length + 1}, minmax(0, 1fr))`,
            }}
          >
            {visibleBottomMenus.map((menu) => {
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
                          isActive
                            ? 'scale-110 text-white'
                            : 'text-slate-500 group-hover:scale-105'
                        }`}
                      />
                      <span
                        className={`mt-1 text-[10px] tracking-tight whitespace-nowrap ${
                          isActive
                            ? 'font-black text-white'
                            : 'font-semibold text-slate-500'
                        }`}
                      >
                        {menu.label}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}

            <button
              type='button'
              onClick={() => setIsDrawerOpen((prev) => !prev)}
              className={`group relative flex w-full flex-col items-center justify-center rounded-2xl py-2 transition-all duration-200 active:scale-95 cursor-pointer ${
                isDrawerOpen
                  ? 'bg-slate-900 text-white font-extrabold shadow-md scale-102'
                  : 'text-slate-500 font-semibold hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Grid
                size={18}
                className={`transition-transform duration-200 ${
                  isDrawerOpen
                    ? 'scale-110 text-white'
                    : 'text-slate-500 group-hover:scale-105'
                }`}
              />
              <span
                className={`mt-1 text-[10px] tracking-tight whitespace-nowrap ${
                  isDrawerOpen
                    ? 'font-black text-white'
                    : 'font-semibold text-slate-500'
                }`}
              >
                Menu
              </span>
            </button>
          </div>
        </nav>
      </div>

      <ShortcutsModal
        open={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </>
  );
}
