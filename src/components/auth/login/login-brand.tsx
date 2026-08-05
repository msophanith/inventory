import { PackageCheck, ShieldCheck } from 'lucide-react';

export function LoginBrand() {
  return (
    <div className='mb-8 text-center space-y-3'>
      {/* Icon badge */}
      <div className='relative mx-auto flex h-16 w-16 items-center justify-center'>
        <div className='absolute inset-0 rounded-2xl bg-indigo-500/20 blur-lg animate-pulse' />
        <div className='relative flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-tr from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/25'>
          <PackageCheck size={32} />
        </div>
      </div>

      <div>
        <h1 className='text-2xl sm:text-3xl font-black text-slate-900 tracking-tight'>
          មានលាភ Stock Controller
        </h1>
        <p className='mt-1 text-xs sm:text-sm font-semibold text-slate-500 flex items-center justify-center gap-1.5'>
          <ShieldCheck size={15} className='text-emerald-600' />
          Enterprise Inventory Management
        </p>
      </div>
    </div>
  );
}
