import { Package, Clock, Eye, ShieldAlert } from 'lucide-react';
import type { ActivityLog } from '@/services/activity-log.types';
import { formatDate } from '@/utils/date';
import { LogActionBadge } from './log-action-badge';
import { LogUserBadge } from './log-user-badge';

interface Props {
  logs: ActivityLog[];
  isLoading?: boolean;
  onViewDetails: (log: ActivityLog) => void;
}

export function LogMobileCard({ logs, isLoading, onViewDetails }: Props) {
  if (isLoading) {
    return (
      <div className='md:hidden space-y-2.5'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className='bg-white rounded-2xl p-3.5 border border-slate-200/80 animate-pulse space-y-2.5'
          >
            <div className='flex justify-between items-center'>
              <div className='h-5 w-16 bg-slate-100 rounded-full' />
              <div className='h-3.5 w-20 bg-slate-100 rounded-md' />
            </div>
            <div className='h-4 w-36 bg-slate-100 rounded-md' />
            <div className='h-7 w-full bg-slate-100 rounded-xl' />
          </div>
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className='md:hidden bg-white rounded-2xl p-6 border border-slate-200/80 text-center space-y-1.5'>
        <div className='h-10 w-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto'>
          <ShieldAlert size={20} />
        </div>
        <p className='font-bold text-slate-800 text-xs'>
          No Product Activity Logs
        </p>
        <p className='text-[11px] text-slate-400'>
          Activity logs will appear here in real-time.
        </p>
      </div>
    );
  }

  return (
    <div className='md:hidden space-y-2.5'>
      {logs.map((log) => {
        const changes = log.details?.changes || [];
        return (
          <div
            key={log.id}
            className='bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs space-y-2.5 transition active:bg-slate-50/50'
          >
            {/* Top row: Action & Date */}
            <div className='flex items-center justify-between gap-2'>
              <LogActionBadge action={log.action} />
              <div className='flex items-center gap-1 text-[11px] font-semibold text-slate-400'>
                <Clock size={11} />
                <span>{formatDate(log.createdAt, 'DD/MM HH:mm')}</span>
              </div>
            </div>

            {/* Middle: Product Info */}
            <div className='flex items-center gap-2.5'>
              <div className='h-7 w-7 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-500'>
                <Package size={14} />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='font-bold text-xs text-slate-900 truncate'>
                  {log.entityName}
                </p>
                {log.barcode && (
                  <p className='text-[10px] text-slate-400 font-mono'>
                    {log.barcode}
                  </p>
                )}
              </div>
            </div>

            {/* Changes or Summary */}
            {changes.length > 0 ? (
              <div className='p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1'>
                {changes.slice(0, 2).map((c, i) => (
                  <div key={i} className='flex items-center justify-between text-[11px] gap-2'>
                    <span className='font-bold text-slate-700 truncate max-w-[40%]'>{c.label}</span>
                    <div className='flex items-center gap-1 text-[10px] truncate max-w-[60%] justify-end'>
                      <span className='text-rose-600 line-through'>{String(c.oldValue ?? '')}</span>
                      <span>→</span>
                      <span className='font-mono font-bold text-emerald-700'>{String(c.newValue ?? '')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              log.details?.summary && (
                <p className='text-[11px] text-slate-500 line-clamp-2'>
                  {log.details.summary}
                </p>
              )
            )}

            {/* Footer row: User Badge & Details button */}
            <div className='pt-2 border-t border-slate-100 flex items-center justify-between gap-2'>
              <LogUserBadge name={log.userName} email={log.userEmail} role={log.userRole} />
              <button
                type='button'
                onClick={() => onViewDetails(log)}
                className='inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition text-[11px] font-bold cursor-pointer shrink-0'
              >
                <Eye size={12} />
                <span>Diff</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
