import { ChevronRight, Keyboard, LogOut, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../features/auth/use-auth';
import Logo from './logo';
import type { MenuItem } from './mobile-nav-items';

interface Props {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly menus: readonly MenuItem[];
  readonly onOpenShortcuts: () => void;
}

export function MobileNavDrawer({
  isOpen,
  onClose,
  menus,
  onOpenShortcuts,
}: Props) {
  const { user, signOut, isAdmin, role } = useAuth();

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden'
          onClick={onClose}
        />
      )}

      {/* Slide-Up Bottom Drawer Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[88vh] overflow-y-auto rounded-t-3xl border-t border-slate-200/80 bg-white/95 p-5 pb-8 backdrop-blur-2xl shadow-2xl transition-transform duration-300 ease-out lg:hidden space-y-4 ${
          isOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
      >
        {/* Pull Handle */}
        <div
          className='w-12 h-1.5 rounded-full bg-slate-300 mx-auto cursor-pointer hover:bg-slate-400 transition'
          onClick={onClose}
        />

        {/* Drawer Header */}
        <div className='flex items-center justify-between border-b border-slate-100 pb-3.5'>
          <div className='flex items-center gap-2.5'>
            <Logo />
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                isAdmin
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {role}
            </span>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition cursor-pointer'
          >
            <X size={16} />
          </button>
        </div>

        {/* Section Label */}
        <div className='px-0.5'>
          <p className='text-xs font-extrabold uppercase tracking-wider text-slate-400'>
            Navigation Menu
          </p>
        </div>

        {/* Navigation Grid */}
        <div className='grid grid-cols-2 gap-2.5'>
          {menus.map((menu) => {
            const Icon = menu.icon;
            return (
              <NavLink
                key={menu.to}
                to={menu.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `group relative flex flex-col justify-between rounded-2xl p-3.5 border transition-all duration-200 active:scale-97 ${
                    isActive
                      ? 'border-indigo-500/40 bg-indigo-50/70 text-indigo-950 shadow-xs ring-1 ring-indigo-500/20'
                      : 'border-slate-200/70 bg-slate-50/60 hover:bg-slate-100/80 text-slate-700'
                  }`
                }
              >
                <div className='flex items-center justify-between mb-2'>
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${menu.badgeColor} text-white shadow-xs`}
                  >
                    <Icon size={18} />
                  </div>
                  <ChevronRight
                    size={15}
                    className='text-slate-300 group-hover:text-slate-500 transition-transform group-hover:translate-x-0.5'
                  />
                </div>
                <div>
                  <h4 className='font-bold text-xs text-slate-900 leading-snug'>
                    {menu.label}
                  </h4>
                  <p className='text-[10px] text-slate-500 font-medium line-clamp-1 mt-0.5'>
                    {menu.description}
                  </p>
                </div>
              </NavLink>
            );
          })}
        </div>

        {/* Action Controls & User Card */}
        <div className='pt-1 space-y-2.5'>
          <button
            type='button'
            onClick={() => {
              onClose();
              onOpenShortcuts();
            }}
            className='flex w-full items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-3 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition shadow-2xs cursor-pointer'
          >
            <div className='flex items-center gap-2.5'>
              <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600'>
                <Keyboard size={16} />
              </div>
              <span>Keyboard Shortcuts Guide</span>
            </div>
            <span className='font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-500'>
              Press ?
            </span>
          </button>

          <div className='flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3'>
            <div className='flex items-center gap-2.5 min-w-0'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-xs font-black text-white shadow-xs'>
                {user?.email?.charAt(0).toUpperCase() ?? '?'}
              </div>
              <div className='min-w-0'>
                <p className='text-xs font-bold text-slate-900 truncate'>
                  {user?.email}
                </p>
                <p className='text-[10px] text-slate-500 font-medium capitalize'>
                  {role} Session
                </p>
              </div>
            </div>

            <button
              type='button'
              onClick={async () => {
                onClose();
                await signOut();
              }}
              className='flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 transition cursor-pointer shrink-0 active:scale-95'
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
