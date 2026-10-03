import { Shield, User as UserIcon } from 'lucide-react';

interface Props {
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

export function LogUserBadge({ name, email, role }: Props) {
  const displayName = name || email?.split('@')[0] || 'Unknown User';
  const isAdmin = (role || '').toLowerCase() === 'admin';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className='flex items-center gap-2.5 min-w-0'>
      <div
        className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
          isAdmin
            ? 'bg-linear-to-br from-indigo-500 to-indigo-700 text-white shadow-indigo-200'
            : 'bg-linear-to-br from-slate-600 to-slate-800 text-white shadow-slate-200'
        }`}
      >
        {initial}
      </div>
      <div className='min-w-0 flex flex-col'>
        <div className='flex items-center gap-1.5'>
          <span className='font-bold text-xs text-slate-900 truncate max-w-35 sm:max-w-45'>
            {displayName}
          </span>
          <span
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
              isAdmin
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/50'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {isAdmin ? <Shield size={10} /> : <UserIcon size={10} />}
            {isAdmin ? 'Admin' : 'Cashier'}
          </span>
        </div>
        {email && email !== displayName && (
          <span className='text-[11px] text-slate-400 font-mono truncate max-w-40'>
            {email}
          </span>
        )}
      </div>
    </div>
  );
}
