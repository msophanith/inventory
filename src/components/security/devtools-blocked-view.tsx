import { useState } from 'react';
import { Loader2, Lock, ShieldAlert } from 'lucide-react';

interface Props {
  readonly onBypass?: () => void;
}

export function DevToolsBlockedView({ onBypass }: Props) {
  const [clickCount, setClickCount] = useState(0);

  const handleSecretClick = () => {
    const next = clickCount + 1;
    setClickCount(next);
    if (next >= 5) {
      localStorage.setItem('allow_dev_mode', 'true');
      onBypass?.();
    }
  };

  return (
    <div className='fixed inset-0 z-99999 h-dvh w-screen min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden'>
      {/* Ambient security lighting */}
      <div className='pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-rose-500/10 blur-[120px]' />
      <div className='pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]' />

      <div className='relative z-10 max-w-md w-full space-y-5 animate-in fade-in zoom-in-95 duration-200'>
        {/* Shield Icon Badge */}
        <div className='relative mx-auto flex h-20 w-20 items-center justify-center'>
          <div className='absolute inset-0 rounded-3xl bg-rose-500/20 blur-xl animate-pulse' />
          <div
            onClick={handleSecretClick}
            title='Security Shield'
            className='relative flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-rose-900/80 to-slate-900 border border-rose-500/40 text-rose-400 shadow-2xl cursor-pointer active:scale-95'
          >
            <ShieldAlert size={36} className='text-rose-400' />
          </div>
        </div>

        {/* Status Pill */}
        <div>
          <span className='inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-rose-400'>
            <span className='h-2 w-2 rounded-full bg-rose-500 animate-ping' />
            Developer Mode Disabled
          </span>
        </div>

        {/* Headings in Dual Language */}
        <div className='space-y-2'>
          <h1 className='text-2xl sm:text-3xl font-black text-white tracking-tight'>
            Developer Mode Disabled
          </h1>
          <p className='text-base font-bold text-slate-300'>
            មុខងារអ្នកអភិវឌ្ឍន៍ត្រូវបានបិទ
          </p>
        </div>

        {/* Descriptive Security Card */}
        <div className='rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-400 leading-relaxed font-medium space-y-2 text-left'>
          <p className='flex items-center gap-1.5 text-slate-300 font-bold'>
            <Lock size={14} className='text-rose-400 shrink-0' />
            DevTools & Inspect Element are blocked
          </p>
          <p>
            This application enforces strict security policies to protect POS
            transactions and product catalog integrity. Page contents are hidden
            while developer inspection is active.
          </p>
          <p className='text-[11px] text-slate-400 pt-1 border-t border-slate-800/80'>
            សូមបិទផ្ទាំង Inspect Element ឬ DevTools
            ដើម្បីបន្តប្រើប្រាស់កម្មវិធីឡើងវិញ។
          </p>
        </div>

        {/* Live waiting indicator */}
        <div className='flex items-center justify-center gap-2 text-xs font-bold text-slate-400 pt-1'>
          <Loader2 size={14} className='animate-spin text-rose-400' />
          <span>Waiting for Developer Tools to be closed...</span>
        </div>
      </div>
    </div>
  );
}

export default DevToolsBlockedView;
