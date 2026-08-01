import { useState, useEffect } from 'react';
import { Loader2, LogOut, ShieldCheck, User, X } from 'lucide-react';
import { useAuth } from '../../features/auth/use-auth';
import Logo from './logo';
import { NotificationBell } from './notification-bell';
import { KhrRateSelector } from './khr-rate-selector';

export default function Navbar() {
  const { user, signOut, isAdmin, role } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initial = user?.email?.charAt(0).toUpperCase() ?? '?';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoggingOut) setShowConfirmModal(false);
    };
    if (showConfirmModal) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showConfirmModal, isLoggingOut]);

  const handleConfirmSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } finally {
      setIsLoggingOut(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <header className='sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md transition-all sm:px-6 lg:h-20 lg:px-8 shadow-xs'>
        <div className='lg:hidden'>
          <Logo />
        </div>

        <div className='hidden lg:flex lg:items-center lg:gap-3'>
          <div className='flex items-center gap-2 rounded-full bg-slate-100/70 border border-slate-200/60 px-3 py-1.5 text-xs text-slate-600 font-medium'>
            <span className='relative flex h-2 w-2'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
              <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-500' />
            </span>
            <span>System Online</span>
          </div>

          {/* KHR Exchange Rate Chip & Selector */}
          <KhrRateSelector />
        </div>

        <div className='flex items-center gap-2.5 sm:gap-4'>
          {/* Mobile Exchange Rate Badge */}
          <div className='lg:hidden'>
            <KhrRateSelector />
          </div>

          <NotificationBell />

          <div className='flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-slate-50/60 p-1.5 pr-3.5 transition-all hover:bg-slate-100/80 shadow-2xs'>
            <div className='relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 text-sm font-extrabold text-white shadow-xs ring-2 ring-indigo-500/20'>
              {initial}
              <span className='absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500' />
            </div>

            <div className='hidden flex-col lg:flex'>
              <span className='max-w-44 truncate text-xs font-bold text-slate-900 leading-snug'>
                {user?.email ?? 'User Account'}
              </span>
              <span className='flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500'>
                {isAdmin ? (
                  <>
                    <ShieldCheck size={11} className='text-indigo-500' />
                    Admin Manager
                  </>
                ) : (
                  <>
                    <User size={11} className='text-emerald-500' />
                    POS Cashier
                  </>
                )}
              </span>
            </div>
          </div>

          <button
            id='btn-sign-out'
            type='button'
            onClick={() => setShowConfirmModal(true)}
            title='Sign out'
            className='group flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 hover:shadow-xs cursor-pointer active:scale-95'
          >
            <LogOut size={16} className='transition-transform duration-200 group-hover:-translate-x-0.5 text-slate-500 group-hover:text-rose-600' />
            <span className='hidden sm:inline'>Sign out</span>
          </button>
        </div>
      </header>

      {showConfirmModal && (
        <div
          className='fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200'
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className='w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white p-4 pb-8 sm:p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-start justify-between'>
              <div className='flex items-center gap-3.5'>
                <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-4 ring-rose-50/50 shadow-inner'>
                  <LogOut size={22} />
                </div>
                <div>
                  <h3 className='text-lg font-bold text-slate-900'>Sign Out</h3>
                  <p className='text-xs text-slate-500 font-medium'>End active session</p>
                </div>
              </div>

              <button onClick={() => setShowConfirmModal(false)} className='rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 transition'>
                <X size={18} />
              </button>
            </div>

            <p className='text-sm text-slate-600 leading-relaxed font-medium bg-slate-50/80 rounded-2xl p-4 border border-slate-100'>
              Are you sure you want to sign out ({user?.email})? You will need to log back in to access the system as {role}.
            </p>

            <div className='flex gap-3 pt-1'>
              <button
                type='button'
                disabled={isLoggingOut}
                onClick={() => setShowConfirmModal(false)}
                className='flex-1 rounded-xl border border-slate-200/80 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs disabled:opacity-50'
              >
                Cancel
              </button>
              <button
                type='button'
                disabled={isLoggingOut}
                onClick={handleConfirmSignOut}
                className='flex-1 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-500/20 hover:from-rose-700 hover:to-red-700 transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60'
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 size={15} className='animate-spin' />
                    <span>Signing Out…</span>
                  </>
                ) : (
                  <>
                    <LogOut size={15} />
                    <span>Yes, Sign Out</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
