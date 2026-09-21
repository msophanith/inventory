import { Keyboard } from 'lucide-react';
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
      <div className='p-3 border-t border-slate-100 flex flex-col items-center gap-2.5 shrink-0'>
        <button
          type='button'
          onClick={onOpenShortcuts}
          title={`${t('common.shortcutsGuide')} (?)`}
          className='flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all cursor-pointer shadow-2xs active:scale-95'
        >
          <Keyboard size={18} />
        </button>
        <span
          title={`Version 1.0.3 • ${isAdmin ? 'Admin' : 'Cashier'}`}
          className='flex items-center gap-1 font-mono text-[9px] font-bold text-slate-400 bg-slate-50 border border-slate-200/60 rounded-md px-1.5 py-0.5'
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isAdmin ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
          />
          1.0.3
        </span>
      </div>
    );
  }

  return (
    <div className='p-3 border-t border-slate-100/90 space-y-2 shrink-0 bg-slate-50/50'>
      {/* Shortcuts trigger button */}
      <button
        type='button'
        onClick={onOpenShortcuts}
        className='group flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:border-indigo-200 hover:bg-indigo-50/60 hover:text-indigo-600 active:scale-[0.98] transition-all cursor-pointer'
      >
        <div className='flex items-center gap-2.5 min-w-0'>
          <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xs'>
            <Keyboard size={13} />
          </div>
          <span className='font-medium text-[12px] truncate'>
            {t('common.shortcutsGuide')}
          </span>
        </div>
        <kbd className='flex h-5 min-w-5 items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-1.5 font-mono text-[10px] font-bold text-slate-500 shadow-2xs group-hover:border-indigo-200 group-hover:bg-white group-hover:text-indigo-600 transition-colors'>
          ?
        </kbd>
      </button>

      {/* Meta Card: Version, Copyright & Attribution */}
      <div className='rounded-xl border border-slate-200/70 bg-white/80 p-2.5 shadow-2xs space-y-1.5'>
        <div className='flex items-center justify-between text-[11px] font-medium'>
          <span className='text-slate-600 font-semibold truncate'>
            © {currentYear} {t('common.appName')}
          </span>
          <span className='inline-flex items-center gap-1 rounded-md border border-slate-200/70 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-500 shrink-0'>
            <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
            v1.0.3
          </span>
        </div>

        <div className='flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px] text-slate-400'>
          <span>{t('common.developedBy')}</span>
          <span className='font-bold text-slate-700 hover:text-indigo-600 transition-colors'>
            Sophanith Mey
          </span>
        </div>
      </div>
    </div>
  );
}

export default SidebarFooter;
