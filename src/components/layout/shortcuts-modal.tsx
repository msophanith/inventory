import { Keyboard, X } from 'lucide-react';
import { SHORTCUT_LIST } from '../../hooks/use-keyboard-shortcuts';

interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
}

export function ShortcutsModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150'
      onClick={onClose}
    >
      <div
        className='w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between border-b border-slate-100 pb-3.5'>
          <div className='flex items-center gap-3'>
            <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner'>
              <Keyboard size={22} />
            </div>
            <div>
              <h3 className='text-lg font-bold text-slate-900'>Single Key Shortcuts</h3>
              <p className='text-xs text-slate-400 font-medium'>Press key anytime (when not typing)</p>
            </div>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer'
          >
            <X size={18} />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className='space-y-2 max-h-80 overflow-y-auto pr-1'>
          {SHORTCUT_LIST.map((s) => (
            <div
              key={s.label}
              className='flex items-center justify-between rounded-2xl bg-slate-50/80 border border-slate-100 px-4 py-3 text-xs font-semibold'
            >
              <span className='text-slate-700 font-bold'>{s.description}</span>
              <kbd className='rounded-xl bg-white px-3 py-1 font-mono text-[11px] font-black text-indigo-600 border border-slate-200 shadow-2xs uppercase'>
                {s.label}
              </kbd>
            </div>
          ))}
          <div className='flex items-center justify-between rounded-2xl bg-slate-50/80 border border-slate-100 px-4 py-3 text-xs font-semibold'>
            <span className='text-slate-700 font-bold'>Toggle Shortcuts Guide</span>
            <kbd className='rounded-xl bg-white px-3 py-1 font-mono text-[11px] font-black text-indigo-600 border border-slate-200 shadow-2xs'>
              ?
            </kbd>
          </div>
        </div>

        {/* Footer */}
        <div className='pt-1 text-center'>
          <button
            type='button'
            onClick={onClose}
            className='w-full rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 cursor-pointer transition'
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
}
