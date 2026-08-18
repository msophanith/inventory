import { Code2 } from 'lucide-react';

export function LoginFooter() {
  return (
    <div className='mt-8 text-center space-y-2'>
      <p className='text-xs font-semibold text-slate-500 flex items-center justify-center gap-1.5'>
        <Code2 size={14} className='text-emerald-600' />
        មានលាភ · {new Date().getFullYear()}
      </p>
    </div>
  );
}
