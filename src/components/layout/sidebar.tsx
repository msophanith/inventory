import { useState } from 'react';
import {
  Box,
  ChevronLeft,
  ChevronRight,
  Code,
  Gauge,
  HistoryIcon,
  Keyboard,
  QrCode,
  RefreshCcw,
  ShoppingCart,
  UserCheck,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Logo from './logo';
import { ShortcutsModal } from './shortcuts-modal';
import { useAuth } from '../../features/auth/use-auth';
import { useLanguage } from '../../i18n/language-context';

export default function Sidebar() {
  const { isAdmin, role } = useAuth();
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  const menus = [
    { icon: Gauge, label: t('reports.dashboard'), to: '/', shortcut: 'D', adminOnly: true },
    { icon: ShoppingCart, label: t('pos.cart'), to: '/sell', shortcut: 'S', adminOnly: false },
    { icon: QrCode, label: t('pos.scanBarcode'), to: '/scan', shortcut: 'C', adminOnly: false },
    { icon: Box, label: t('products.products'), to: '/products', shortcut: 'P', adminOnly: true },
    { icon: RefreshCcw, label: t('movement.stockMovement'), to: '/movement', shortcut: 'M', adminOnly: true },
    { icon: HistoryIcon, label: t('reports.reports'), to: '/report', shortcut: 'R', adminOnly: true },
  ];

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
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className='flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer mx-auto'
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
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
                  title={isCollapsed ? `${menu.label} (Press ${menu.shortcut})` : undefined}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-2xl py-3 transition-all duration-300 ${
                      isCollapsed ? 'justify-center px-0' : 'px-4'
                    } ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg shadow-indigo-500/10'
                        : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                    }`
                  }
                >
                  <div className='flex items-center gap-3.5 min-w-0'>
                    <Icon size={20} className='transition-transform group-hover:rotate-12 shrink-0' />
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

        {!isCollapsed ? (
          <div className='m-4 space-y-2'>
            <button
              type='button'
              onClick={() => setIsShortcutsModalOpen(true)}
              className='flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer'
            >
              <div className='flex items-center gap-2'>
                <Keyboard size={16} className='text-indigo-500' />
                <span>Shortcuts Guide</span>
              </div>
              <span className='font-mono text-[10px] text-slate-400'>Press ?</span>
            </button>

            <div className='rounded-3xl bg-linear-to-r from-slate-900 to-indigo-950 p-4 text-white shadow-md space-y-1'>
              <div className='flex items-center justify-between'>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${isAdmin ? 'bg-amber-400 text-slate-950' : 'bg-emerald-400 text-slate-950'}`}>
                  {role}
                </span>
              </div>
              <p className='text-xs text-slate-300 flex items-center gap-1 font-medium'>
                <UserCheck size={12} className='text-indigo-400' />
                {isAdmin ? t('common.adminManager') : t('common.posCashier')}
              </p>
              <p className='text-xs text-slate-300 flex items-center gap-1 font-medium'>
                <Code size={12} className='text-indigo-400' />
                <span>Version: 1.0.0</span>
              </p>
            </div>
          </div>
        ) : (
          <div className='mb-4 flex flex-col items-center gap-3'>
            <button
              type='button'
              onClick={() => setIsShortcutsModalOpen(true)}
              title='Keyboard Shortcuts Guide (Press ?)'
              className='flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer'
            >
              <Keyboard size={18} />
            </button>
            <div className={`h-2.5 w-2.5 rounded-full ${isAdmin ? 'bg-amber-400' : 'bg-emerald-400'} shadow-xs`} />
          </div>
        )}
      </aside>

      <ShortcutsModal open={isShortcutsModalOpen} onClose={() => setIsShortcutsModalOpen(false)} />
    </>
  );
}
