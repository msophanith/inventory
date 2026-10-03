import { Package, Eye, Calendar } from 'lucide-react';
import type { ActivityLog } from '@/services/activity-log.types';
import { formatDate } from '@/utils/date';
import { LogActionBadge } from './log-action-badge';
import { LogUserBadge } from './log-user-badge';

interface Props {
  log: ActivityLog;
  onViewDetails: (log: ActivityLog) => void;
}

export function LogTableRow({ log, onViewDetails }: Props) {
  const changes = log.details?.changes || [];
  const hasChanges = changes.length > 0;

  return (
    <tr className='border-b border-slate-100 hover:bg-slate-50/60 transition group'>
      {/* Action */}
      <td className='px-4 py-3.5 whitespace-nowrap align-middle'>
        <LogActionBadge action={log.action} />
      </td>

      {/* Product */}
      <td className='px-4 py-3.5 align-middle'>
        <div className='flex items-center gap-2.5 min-w-45 max-w-65'>
          <div className='h-8 w-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-500'>
            <Package size={16} />
          </div>
          <div className='min-w-0'>
            <p className='font-bold text-xs text-slate-900 truncate' title={log.entityName}>
              {log.entityName}
            </p>
            {log.barcode && (
              <p className='text-[11px] text-slate-400 font-mono truncate'>
                {log.barcode}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Details Summary */}
      <td className='px-4 py-3.5 align-middle max-w-75'>
        {hasChanges ? (
          <div className='flex flex-wrap gap-1'>
            {changes.slice(0, 2).map((c, idx) => (
              <span
                key={idx}
                className='inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md truncate max-w-45'
              >
                <span className='font-bold'>{c.label}:</span>
                <span className='text-rose-600 line-through text-[10px]'>{String(c.oldValue ?? '')}</span>
                <span>→</span>
                <span className='text-emerald-700 font-bold'>{String(c.newValue ?? '')}</span>
              </span>
            ))}
            {changes.length > 2 && (
              <span className='text-[10px] font-bold text-slate-400 px-1 py-0.5'>
                +{changes.length - 2} more
              </span>
            )}
          </div>
        ) : (
          <p className='text-xs text-slate-600 truncate font-medium'>
            {log.details?.summary || `Product ${log.action.toLowerCase()}`}
          </p>
        )}
      </td>

      {/* Performed By */}
      <td className='px-4 py-3.5 whitespace-nowrap align-middle'>
        <LogUserBadge name={log.userName} email={log.userEmail} role={log.userRole} />
      </td>

      {/* Timestamp */}
      <td className='px-4 py-3.5 whitespace-nowrap align-middle'>
        <div className='flex items-center gap-1.5 text-xs font-semibold text-slate-700'>
          <Calendar size={13} className='text-slate-400 shrink-0' />
          <span>{formatDate(log.createdAt, 'DD MMM YYYY, HH:mm')}</span>
        </div>
      </td>

      {/* Action Button */}
      <td className='px-4 py-3.5 whitespace-nowrap text-right align-middle'>
        <button
          type='button'
          onClick={() => onViewDetails(log)}
          className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-xs font-bold transition shadow-2xs cursor-pointer'
        >
          <Eye size={13} />
          <span>Details</span>
        </button>
      </td>
    </tr>
  );
}
