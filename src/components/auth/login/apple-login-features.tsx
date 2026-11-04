import { DollarSign, ShieldCheck, Zap } from 'lucide-react';

export function AppleLoginFeatures() {
  return (
    <div className='pt-5 border-t border-slate-200/60 grid grid-cols-3 gap-2.5 text-center'>
      <div className='flex flex-col items-center gap-1 p-2 rounded-2xl bg-slate-50/80 border border-slate-200/60 shadow-2xs'>
        <DollarSign size={14} className='text-emerald-600' />
        <span className='text-[10px] font-semibold text-slate-700'>
          USD · KHR
        </span>
      </div>
      <div className='flex flex-col items-center gap-1 p-2 rounded-2xl bg-slate-50/80 border border-slate-200/60 shadow-2xs'>
        <Zap size={14} className='text-amber-500' />
        <span className='text-[10px] font-semibold text-slate-700'>
          Laser Scan
        </span>
      </div>
      <div className='flex flex-col items-center gap-1 p-2 rounded-2xl bg-slate-50/80 border border-slate-200/60 shadow-2xs'>
        <ShieldCheck size={14} className='text-blue-600' />
        <span className='text-[10px] font-semibold text-slate-700'>
          End-to-End
        </span>
      </div>
    </div>
  );
}
