import { Bell, Navigation, Smartphone, Volume2, X } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';
import type { ScanSettings } from '../types';

interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly settings: ScanSettings;
  readonly onUpdateSettings: (patch: Partial<ScanSettings>) => void;
}

export function ScanSettingsModal({ open, onClose, settings, onUpdateSettings }: Props) {
  const { t } = useLanguage();

  if (!open) return null;

  const toggleItems = [
    {
      key: 'autoRedirect',
      icon: Navigation,
      label: t('scan.autoRedirect'),
      desc: t('scan.autoRedirectDesc'),
      value: settings.autoRedirect,
      onToggle: () => onUpdateSettings({ autoRedirect: !settings.autoRedirect }),
    },
    {
      key: 'continuous',
      icon: Smartphone,
      label: t('scan.continuousScan'),
      desc: t('scan.continuousScanDesc'),
      value: settings.continuous,
      onToggle: () => onUpdateSettings({ continuous: !settings.continuous }),
    },
    {
      key: 'sound',
      icon: Volume2,
      label: t('scan.soundFeedback'),
      desc: t('scan.soundFeedbackDesc'),
      value: settings.sound,
      onToggle: () => onUpdateSettings({ sound: !settings.sound }),
    },
    {
      key: 'vibrate',
      icon: Bell,
      label: t('scan.vibrateFeedback'),
      desc: t('scan.vibrateFeedbackDesc'),
      value: settings.vibrate,
      onToggle: () => onUpdateSettings({ vibrate: !settings.vibrate }),
    },
  ];

  return (
    <div className='fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200'>
      <div className='w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200'>
        <div className='flex items-center justify-between border-b border-slate-100 pb-3'>
          <h3 className='font-black text-slate-900 text-base'>
            {t('scan.settings')}
          </h3>
          <button
            type='button'
            onClick={onClose}
            className='rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer'
          >
            <X size={18} />
          </button>
        </div>

        <div className='space-y-3'>
          {toggleItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                onClick={item.onToggle}
                className='flex items-center justify-between gap-3 p-2.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100 transition cursor-pointer'
              >
                <div className='flex items-center gap-2.5 min-w-0'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-2xs shrink-0'>
                    <Icon size={16} />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-xs font-bold text-slate-900 truncate'>{item.label}</p>
                    <p className='text-[10px] text-slate-400 truncate'>{item.desc}</p>
                  </div>
                </div>

                <div
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    item.value ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      item.value ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button
          type='button'
          onClick={onClose}
          className='w-full rounded-2xl bg-slate-900 py-3 text-xs font-black text-white hover:bg-slate-800 transition active:scale-98 cursor-pointer'
        >
          {t('common.done') || 'Done'}
        </button>
      </div>
    </div>
  );
}
