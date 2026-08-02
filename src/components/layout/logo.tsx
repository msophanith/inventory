import { Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link
      to='/'
      className='flex items-center gap-2 sm:gap-3 transition-opacity hover:opacity-80 shrink-0'
    >
      <div className='rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 p-2 sm:p-2.5 lg:p-3 text-white shadow-md shadow-emerald-500/10'>
        <Settings2 className='h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6' />
      </div>

      <div className='min-w-0'>
        <h1 className='text-xs sm:text-base lg:text-lg font-black text-slate-900 tracking-tight truncate leading-tight'>
          Inventory App
        </h1>
        <p className='hidden sm:block text-[10px] sm:text-xs text-slate-500 font-medium truncate'>
          Smart Inventory Manager
        </p>
      </div>
    </Link>
  );
}
