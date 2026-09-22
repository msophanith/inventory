import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../features/auth/use-auth';
import Logo from './logo';
import { NotificationBell } from './notification-bell';
import { KhrRateSelector } from './khr-rate-selector';
import { LanguageSelector } from './language-selector';
import { SignoutModal } from './signout-modal';
import { NavbarUserMenu } from './navbar-user-menu';
import { ShortcutsModal } from './shortcuts-modal';
import { useLanguage } from '../../i18n/language-context';

export default function Navbar() {
  const { user, signOut, isAdmin, role } = useAuth();
  const { t } = useLanguage();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

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
      <header className='relative sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/80 px-3 sm:px-6 lg:px-8 backdrop-blur-2xl transition-all shadow-xs before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-linear-to-r before:from-transparent before:via-indigo-500/20 before:to-transparent'>
        {/* Mobile Logo */}
        <div className='lg:hidden shrink-0'>
          <Logo />
        </div>

        {/* Desktop Left Operational Cluster */}
        <div className='hidden lg:flex lg:items-center lg:gap-2.5'>
          <div className='flex items-center gap-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/70 px-3 py-1 text-xs text-emerald-800 font-extrabold shadow-2xs'>
            <span className='relative flex h-2 w-2'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
              <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-500' />
            </span>
            <span className='tracking-tight'>{t('common.systemOnline')}</span>
          </div>

          <div className='h-4 w-px bg-slate-200 mx-0.5' />

          <LanguageSelector />
          <KhrRateSelector />
        </div>

        {/* Right Section: Mobile Switches + Notification + User Menu + Quick Sign Out */}
        <div className='flex items-center gap-1.5 sm:gap-2.5 shrink-0'>
          {/* Mobile-only compact switches */}
          <div className='lg:hidden flex items-center gap-1 sm:gap-1.5 shrink-0'>
            <LanguageSelector />
            <KhrRateSelector />
          </div>

          <NotificationBell />

          <div className='hidden sm:block h-5 w-px bg-slate-200 mx-0.5' />

          {/* Interactive User Profile Menu */}
          <NavbarUserMenu
            userEmail={user?.email}
            isAdmin={isAdmin}
            role={role}
            onSignOut={() => setShowConfirmModal(true)}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
          />

          {/* Quick Sign Out Action Button (Desktop & Tablet) */}
          <button
            id='btn-sign-out'
            type='button'
            onClick={() => setShowConfirmModal(true)}
            title={t('common.signOut')}
            className='group hidden sm:flex items-center justify-center gap-1.5 h-9 rounded-2xl border border-slate-200/80 bg-white px-3 text-xs font-extrabold text-slate-700 shadow-2xs hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer active:scale-95 shrink-0'
          >
            <LogOut
              size={15}
              className='transition-transform duration-150 group-hover:-translate-x-0.5 text-slate-400 group-hover:text-rose-600'
            />
            <span className='hidden md:inline'>{t('common.signOut')}</span>
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

      <ShortcutsModal
        open={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </>
  );
}
