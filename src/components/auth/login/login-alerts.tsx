import { AlertCircle } from 'lucide-react';

interface LoginAlertsProps {
  readonly serverError: string | null;
}

export function LoginAlerts({ serverError }: LoginAlertsProps) {
  if (!serverError) return null;

  return (
    <div className='mb-6 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs sm:text-sm text-rose-700 shadow-sm animate-in fade-in duration-300'>
      <AlertCircle size={18} className='shrink-0 text-rose-500' />
      <span className='font-bold'>{serverError}</span>
    </div>
  );
}
