import { ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import type { MenuItem } from './mobile-nav-items';

interface Props {
  readonly menus: readonly MenuItem[];
  readonly onClose: () => void;
}

export function MobileNavGrid({ menus, onClose }: Props) {
  return (
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
  );
}
