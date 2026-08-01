import { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, PackageX, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLowStockNotifications } from '../../features/product/hooks/use-low-stock-notifications';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { lowStockProducts, outOfStockProducts, totalAlertCount } = useLowStockNotifications();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        type='button'
        onClick={() => setIsOpen((prev) => !prev)}
        title='Stock Alert Notifications'
        className='relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100/80 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer active:scale-95'
      >
        <Bell size={18} />
        {totalAlertCount > 0 && (
          <span className='absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-xs ring-2 ring-white animate-pulse'>
            {totalAlertCount > 99 ? '99+' : totalAlertCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className='absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-3xl bg-white p-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 space-y-3'>
          <div className='flex items-center justify-between border-b border-slate-100 pb-2.5'>
            <div className='flex items-center gap-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600'>
                <Bell size={16} />
              </div>
              <h4 className='font-extrabold text-slate-900 text-sm'>Stock Alerts</h4>
            </div>
            <span className='rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-extrabold text-rose-700 uppercase'>
              {totalAlertCount} Items Need Attention
            </span>
          </div>

          <div className='max-h-72 overflow-y-auto space-y-2 pr-1'>
            {totalAlertCount === 0 ? (
              <div className='flex flex-col items-center justify-center py-6 text-center text-slate-400 space-y-1.5'>
                <CheckCircle2 size={32} className='text-emerald-500' />
                <p className='text-xs font-bold text-slate-700'>All Items Healthy!</p>
                <p className='text-[11px] text-slate-400'>No low-stock or out-of-stock warnings.</p>
              </div>
            ) : (
              <>
                {outOfStockProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setIsOpen(false);
                      navigate(`/products/${p.id}`);
                    }}
                    className='flex items-center justify-between rounded-2xl bg-rose-50/70 border border-rose-100 p-3 hover:bg-rose-100/60 transition cursor-pointer group'
                  >
                    <div className='flex items-center gap-2.5 min-w-0'>
                      <PackageX size={18} className='text-rose-600 shrink-0' />
                      <div className='min-w-0'>
                        <p className='text-xs font-bold text-slate-900 truncate'>{p.name}</p>
                        <p className='text-[10px] text-rose-600 font-semibold'>Out of Stock (0 {p.unit})</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className='text-slate-400 group-hover:translate-x-0.5 transition shrink-0' />
                  </div>
                ))}

                {lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setIsOpen(false);
                      navigate(`/products/${p.id}`);
                    }}
                    className='flex items-center justify-between rounded-2xl bg-amber-50/70 border border-amber-100 p-3 hover:bg-amber-100/60 transition cursor-pointer group'
                  >
                    <div className='flex items-center gap-2.5 min-w-0'>
                      <AlertTriangle size={18} className='text-amber-600 shrink-0' />
                      <div className='min-w-0'>
                        <p className='text-xs font-bold text-slate-900 truncate'>{p.name}</p>
                        <p className='text-[10px] text-amber-700 font-semibold'>Low Stock ({p.quantity} / min {p.minStock} {p.unit})</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className='text-slate-400 group-hover:translate-x-0.5 transition shrink-0' />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
