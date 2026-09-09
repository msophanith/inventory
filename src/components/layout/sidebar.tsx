import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Logo from './logo';
import { ShortcutsModal } from './shortcuts-modal';
import { SidebarFooter } from './sidebar-footer';
import { getSidebarMenus } from './sidebar-menu-items';
import { useAuth } from '../../features/auth/use-auth';
import { useLanguage } from '../../i18n/language-context';

export default function Sidebar() {
  const { isAdmin, role } = useAuth();
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true';
  });
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

  const menus = getSidebarMenus(t);
  const visibleMenus = menus.filter((m) => isAdmin || !m.adminOnly);

  return (
    <>
      <aside
        className={`hidden h-screen border-r border-slate-200 bg-white transition-all duration-300 ease-in-out lg:flex lg:flex-col sticky top-0 ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <div className='flex items-center justify-between p-5 border-b border-slate-100'>
          {!isCollapsed && <Logo />}
          <button
            type='button'
            onClick={toggleCollapse}
            title={
              isCollapsed
                ? t('common.expandSidebar')
                : t('common.collapseSidebar')
            }
            className='flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer mx-auto'
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>

        <div className='flex-1 px-3 py-4 overflow-y-auto'>
          <div className='space-y-2'>
            {visibleMenus.map((menu) => {
              const Icon = menu.icon;

              return (
                <NavLink
                  key={menu.to}
                  to={menu.to}
                  title={
                    isCollapsed
                      ? `${menu.label} (Press ${menu.shortcut})`
                      : undefined
                  }
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-2xl py-3 transition-all duration-300 ${
                      isCollapsed ? 'justify-center px-0' : 'px-4'
                    } ${
                      isActive
                        ? 'bg-linear-to-r from-blue-500 to-emerald-500 text-white shadow-lg shadow-indigo-500/10'
                        : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                    }`
                  }
                >
                  <div className='flex items-center gap-3.5 min-w-0'>
                    <Icon
                      size={20}
                      className='transition-transform group-hover:rotate-12 shrink-0'
                    />
                    {!isCollapsed && (
                      <span className='font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis'>
                        {menu.label}
                      </span>
                    )}
                  </div>

                  {!isCollapsed && (
                    <kbd className='rounded-lg bg-black/10 px-2 py-0.5 font-mono text-[10px] font-black text-current uppercase opacity-85 shrink-0'>
                      {menu.shortcut}
                    </kbd>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        <SidebarFooter
          isCollapsed={isCollapsed}
          isAdmin={isAdmin}
          role={role}
          onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        />
      </aside>

      <ShortcutsModal
        open={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </>
  );
}
