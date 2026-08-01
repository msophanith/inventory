import { useState } from 'react';
import {
  Box,
  ChevronLeft,
  ChevronRight,
  Gauge,
  HistoryIcon,
  RefreshCcw,
  ShoppingCart,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Logo from './logo';

const menus = [
  { icon: Gauge, label: 'Dashboard', to: '/' },
  { icon: ShoppingCart, label: 'POS / Sell', to: '/sell' },
  { icon: Box, label: 'Products', to: '/products' },
  { icon: RefreshCcw, label: 'Movement', to: '/movement' },
  { icon: HistoryIcon, label: 'Report', to: '/report' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`hidden h-screen border-r border-slate-200 bg-white transition-all duration-300 ease-in-out lg:flex lg:flex-col sticky top-0 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Sidebar Header & Toggle */}
      <div className='flex items-center justify-between p-5 border-b border-slate-100'>
        {!isCollapsed && <Logo />}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className='flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer mx-auto'
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className='flex-1 px-3 py-4 overflow-y-auto'>
        <div className='space-y-2'>
          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <NavLink
                key={menu.to}
                to={menu.to}
                title={isCollapsed ? menu.label : undefined}
                className={({ isActive }) =>
                  `group flex items-center gap-4 rounded-2xl py-3 transition-all duration-300 ${
                    isCollapsed ? 'justify-center px-0' : 'px-4'
                  } ${
                    isActive
                      ? 'bg-linear-to-r from-blue-400 to-green-400 text-white shadow-lg'
                      : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                  }`
                }
              >
                <Icon
                  size={20}
                  className='transition-transform group-hover:rotate-12 shrink-0'
                />

                {!isCollapsed && (
                  <span className='font-medium whitespace-nowrap overflow-hidden text-ellipsis'>
                    {menu.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom Info Card */}
      {!isCollapsed ? (
        <div className='m-4 rounded-3xl bg-linear-to-r from-blue-400 to-green-400 p-4 text-white shadow-md'>
          <p className='text-base font-bold'>Inventory App</p>
          <p className='mt-1 text-xs text-indigo-100'>
            Track everything in one place.
          </p>
        </div>
      ) : (
        <div className='mb-4 flex justify-center'>
          <div className='h-3 w-3 rounded-full bg-emerald-400 shadow-xs' />
        </div>
      )}
    </aside>
  );
}
