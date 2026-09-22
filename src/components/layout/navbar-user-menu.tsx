import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Command, LogOut, ShieldCheck, User } from 'lucide-react';
import { useLanguage } from '../../i18n/language-context';

interface Props {
  readonly userEmail?: string;
  readonly isAdmin: boolean;
  readonly role?: string;
  readonly onSignOut: () => void;
  readonly onOpenShortcuts?: () => void;
}

export function NavbarUserMenu({
  userEmail,
  isAdmin,
  onSignOut,
  onOpenShortcuts,
}: Props) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initial = userEmail?.charAt(0).toUpperCase() ?? '?';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className='relative shrink-0' ref={menuRef}>
      <button
        type='button'
        onClick={() => setIsOpen((prev) => !prev)}
        className='group flex items-center gap-2 sm:gap-2.5 rounded-2xl border border-slate-200/80 bg-white/90 p-1 sm:pr-3 sm:pl-1.5 shadow-2xs hover:border-slate-300 hover:bg-white hover:shadow-xs transition-all cursor-pointer active:scale-98'
        aria-expanded={isOpen}
      >
        <div className='relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-xs sm:text-sm font-black text-white shadow-xs group-hover:scale-102 transition-transform'>
          {initial}
          <span className='absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 ring-1 ring-emerald-400/30' />
        </div>

        <div className='hidden flex-col text-left lg:flex'>
          <span className='max-w-36 truncate text-xs font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors'>
            {userEmail ?? t('common.userAccount')}
          </span>
          <div className='flex items-center mt-0.5'>
            {isAdmin ? (
              <span className='inline-flex items-center gap-1 text-[10px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200/70 rounded-md px-1.5 py-0.2'>
                <ShieldCheck size={11} className='text-indigo-600' />
                {t('common.adminManager')}
              </span>
            ) : (
              <span className='inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/70 rounded-md px-1.5 py-0.2'>
                <User size={11} className='text-emerald-600' />
                {t('common.posCashier')}
              </span>
            )}
          </div>
        </div>

        <ChevronDown
          size={14}
          className={`hidden sm:block text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-indigo-600' : 'group-hover:text-slate-600'
          }`}
        />
      </button>

      {isOpen && (
        <div className='absolute right-0 top-12 sm:top-13 z-50 w-72 rounded-3xl bg-white p-3 shadow-2xl border border-slate-100 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150 space-y-2'>
          <div className='flex items-center gap-3 p-2.5 rounded-2xl bg-linear-to-br from-slate-50 to-indigo-50/40 border border-slate-100'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-600 to-violet-600 text-sm font-black text-white shadow-xs shrink-0'>
              {initial}
            </div>
            <div className='min-w-0 flex-1'>
              <p className='text-xs font-black text-slate-900 truncate'>
                {userEmail ?? t('common.userAccount')}
              </p>
              <div className='flex items-center gap-1.5 mt-1'>
                <span className='inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-full px-2 py-0.2'>
                  <span className='h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse' />
                  {isAdmin ? t('common.adminManager') : t('common.posCashier')}
                </span>
              </div>
            </div>
          </div>

          <div className='space-y-0.5 pt-1'>
            {onOpenShortcuts && (
              <button
                type='button'
                onClick={() => {
                  setIsOpen(false);
                  onOpenShortcuts();
                }}
                className='w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors cursor-pointer'
              >
                <div className='flex items-center gap-2'>
                  <Command size={14} className='text-slate-400' />
                  <span>{t('common.shortcutsGuide')}</span>
                </div>
                <kbd className='rounded-md bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-[10px] font-mono text-slate-500'>
                  ?
                </kbd>
              </button>
            )}
          </div>

          <div className='pt-1 border-t border-slate-100'>
            <button
              type='button'
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
              className='w-full flex items-center gap-2 p-2 rounded-xl text-xs font-extrabold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer active:scale-98'
            >
              <LogOut size={15} />
              <span>{t('common.signOut')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
