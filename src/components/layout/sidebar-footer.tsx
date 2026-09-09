import { Code, Keyboard } from 'lucide-react';
import { useLanguage } from '../../i18n/language-context';

interface Props {
  readonly isCollapsed: boolean;
  readonly isAdmin: boolean;
  readonly role?: string;
  readonly onOpenShortcuts: () => void;
}

export function SidebarFooter({
  isCollapsed,
  isAdmin,
  onOpenShortcuts,
}: Props) {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  if (isCollapsed) {
    return (
      <div className='mb-4 flex flex-col items-center gap-3'>
        <button
          type='button'
          onClick={onOpenShortcuts}
          title={`${t('common.shortcutsGuide')} (${t('common.pressToToggle')})`}
          className='flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer'
        >
          <Keyboard size={18} />
        </button>
        <div
          className={`h-2.5 w-2.5 rounded-full ${isAdmin ? 'bg-amber-400' : 'bg-emerald-400'} shadow-xs`}
        />
      </div>
    );
  }

  return (
    <div className='m-4 space-y-2.5 shrink-0'>
      <button
        type='button'
        onClick={onOpenShortcuts}
        className='flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer shadow-2xs'
      >
        <div className='flex items-center gap-2'>
          <Keyboard size={16} className='text-indigo-500' />
          <span>{t('common.shortcutsGuide')}</span>
        </div>
        <span className='font-mono text-[10px] text-slate-400'>
          {t('common.pressToToggle')}
        </span>
      </button>

      {/* Copyright & Developer Attribution */}
      <div className='pt-1 text-center text-[11px] text-slate-400 font-medium space-y-0.5'>
        <p>© {currentYear} {t('common.appName')}</p>
        <p className='text-[11px] text-slate-500 flex items-center justify-center gap-1 font-mono'>
          <Code size={12} className='text-indigo-500' />
          <span>Version 1.0.2</span>
        </p>
        <p className='text-[10px] text-slate-400'>
          {t('common.developedBy')}{' '}
          <span className='font-bold text-slate-600 hover:text-indigo-600 transition-colors'>
            Sophanith Mey
          </span>
        </p>
      </div>
    </div>
  );
}

export default SidebarFooter;
