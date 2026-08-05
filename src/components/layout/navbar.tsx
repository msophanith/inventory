import { useState, useEffect } from 'react';
import { LogOut, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../features/auth/use-auth';
import Logo from './logo';
import { NotificationBell } from './notification-bell';
import { KhrRateSelector } from './khr-rate-selector';
import { SignoutModal } from './signout-modal';

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
      <header className='sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-3 sm:px-6 lg:h-20 lg:px-8 backdrop-blur-md transition-all shadow-xs'>
        <div className='lg:hidden shrink-0'>
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

          <KhrRateSelector />
        </div>

        <div className='flex items-center gap-1.5 sm:gap-3 lg:gap-4 shrink-0'>
          <div className='lg:hidden shrink-0'>
            <KhrRateSelector />
          </div>

          <div className='shrink-0'>
            <NotificationBell />
          </div>

          <div className='flex items-center gap-2 sm:gap-3 rounded-2xl border border-slate-200/60 bg-slate-50/60 p-1 sm:p-1.5 lg:pr-3.5 transition-all hover:bg-slate-100/80 shadow-2xs shrink-0'>
            <div className='relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 text-xs sm:text-sm font-extrabold text-white shadow-xs ring-2 ring-indigo-500/20'>
              {initial}
              <span className='absolute -bottom-0.5 -right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full border-2 border-white bg-emerald-500' />
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
            className='group flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-white p-2 sm:px-3.5 sm:py-2 text-xs font-bold text-slate-700 shadow-2xs transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 hover:shadow-xs cursor-pointer active:scale-95 shrink-0'
          >
            <LogOut size={16} className='transition-transform duration-200 group-hover:-translate-x-0.5 text-slate-500 group-hover:text-rose-600' />
            <span className='hidden sm:inline'>Sign out</span>
          </button>
        </div>
      </header>

      <SignoutModal
        show={showConfirmModal}
        isLoggingOut={isLoggingOut}
        userEmail={user?.email}
        role={role}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSignOut}
      />
    </>
  );
}
