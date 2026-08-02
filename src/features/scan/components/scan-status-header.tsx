import { QrCode, Wifi } from 'lucide-react';

interface Props {
  readonly isListening: boolean;
}

export function ScanStatusHeader({ isListening }: Props) {
  return (
    <div className='rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white shadow-xl border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
      <div className='flex items-center gap-3.5'>
        <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-inner shrink-0'>
          <QrCode size={24} className='animate-pulse' />
        </div>
        <div>
          <h1 className='text-xl font-black tracking-wide'>Scan Lookup Terminal</h1>
          <p className='text-xs text-slate-300 font-medium mt-0.5'>
            Scan barcode with phone camera, hardware barcode reader, or type manually.
          </p>
        </div>
      </div>

      {/* Hardware Scanner Status Badge */}
      <div className='inline-flex items-center gap-2 rounded-2xl bg-slate-800/80 border border-slate-700/80 px-3.5 py-2 text-xs font-bold shrink-0 self-start sm:self-auto'>
        <span className='relative flex h-2.5 w-2.5'>
          {isListening && (
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75' />
          )}
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isListening ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        </span>
        <Wifi size={14} className='text-indigo-400' />
        <span className='text-slate-200'>
          {isListening ? 'Hardware Scanner Ready' : 'Scanner Paused'}
        </span>
      </div>
    </div>
  );
}
