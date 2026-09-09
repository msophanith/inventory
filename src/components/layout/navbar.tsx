import { useState, useEffect } from 'react';
import { LogOut, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../features/auth/use-auth';
import Logo from './logo';
import { NotificationBell } from './notification-bell';
import { KhrRateSelector } from './khr-rate-selector';
import { LanguageSelector } from './language-selector';
import { SignoutModal } from './signout-modal';
import { useLanguage } from '../../i18n/language-context';

export default function Navbar() {
  const { user, signOut, isAdmin, role } = useAuth();
  const { t } = useLanguage();
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
      <header className='sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/85 px-3 sm:px-6 lg:px-8 backdrop-blur-xl transition-all shadow-2xs'>
        {/* Mobile Logo */}
        <div className='lg:hidden shrink-0'>
          <Logo />
        </div>

        {/* Desktop Left Operational Cluster */}
        <div className='hidden lg:flex lg:items-center lg:gap-2.5'>
          <div className='flex items-center gap-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/60 px-2.5 py-1 text-xs text-emerald-800 font-bold shadow-2xs'>
            <span className='relative flex h-2 w-2'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
              <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-500' />
            </span>
            <span>{t('common.systemOnline')}</span>
          </div>

          <div className='h-4 w-px bg-slate-200 mx-0.5' />

          <LanguageSelector />
          <KhrRateSelector />
        </div>

        {/* Right Section: Mobile Controls + Notifications + Profile */}
        <div className='flex items-center gap-2 sm:gap-3 shrink-0'>
          {/* Mobile-only compact switches */}
          <div className='lg:hidden flex items-center gap-1.5 shrink-0'>
            <LanguageSelector />
            <KhrRateSelector />
          </div>

          <NotificationBell />

          <div className='hidden sm:block h-5 w-px bg-slate-200 mx-0.5' />

          {/* User Profile Pill */}
          <div className='flex items-center gap-2.5 rounded-2xl border border-slate-200/70 bg-white px-2 sm:px-2.5 py-1 shadow-2xs hover:border-slate-300 transition-all shrink-0'>
            <div className='relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-xs sm:text-sm font-black text-white shadow-xs'>
              {initial}
              <span className='absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500' />
            </div>

            <div className='hidden flex-col lg:flex'>
              <span className='max-w-40 truncate text-xs font-bold text-slate-800 leading-tight'>
                {user?.email ?? t('common.userAccount')}
              </span>
              <div className='flex items-center mt-0.5'>
                {isAdmin ? (
                  <span className='inline-flex items-center gap-1 text-[10px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200/70 rounded px-1.5 py-0.2'>
                    <ShieldCheck size={11} className='text-indigo-600' />
                    {t('common.adminManager')}
                  </span>
                ) : (
                  <span className='inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/70 rounded px-1.5 py-0.2'>
                    <User size={11} className='text-emerald-600' />
                    {t('common.posCashier')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sign Out Action Button */}
          <button
            id='btn-sign-out'
            type='button'
            onClick={() => setShowConfirmModal(true)}
            title={t('common.signOut')}
            className='group flex items-center justify-center gap-1.5 h-9 rounded-xl border border-slate-200/80 bg-white p-2 sm:px-3 text-xs font-bold text-slate-700 shadow-2xs hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer active:scale-95 shrink-0'
          >
            <LogOut size={15} className='transition-transform duration-150 group-hover:-translate-x-0.5 text-slate-400 group-hover:text-rose-600' />
            <span className='hidden sm:inline'>{t('common.signOut')}</span>
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
