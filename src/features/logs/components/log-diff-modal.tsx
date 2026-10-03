import { X, ArrowRight, Package, Clock } from 'lucide-react';
import type { ActivityLog } from '@/services/activity-log.types';
import { formatDate } from '@/utils/date';
import { LogActionBadge } from './log-action-badge';
import { LogUserBadge } from './log-user-badge';

interface Props {
  log: ActivityLog | null;
  open: boolean;
  onClose: () => void;
}

export function LogDiffModal({ log, open, onClose }: Props) {
  if (!open || !log) return null;

  const changes = log.details?.changes || [];
  const hasChanges = changes.length > 0;

  return (
    <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200'>
      <div className='w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[90vh] animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200'>
        {/* Header */}
        <div className='p-4 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/50'>
          <div className='space-y-1 min-w-0'>
            <div className='flex items-center gap-2'>
              <LogActionBadge action={log.action} />
              <span className='text-[11px] font-semibold text-slate-400 font-mono'>
                #{log.id.slice(0, 8)}
              </span>
            </div>
            <h3 className='text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5 truncate'>
              <Package size={16} className='text-indigo-600 shrink-0' />
              <span className='truncate'>{log.entityName}</span>
            </h3>
            {log.barcode && (
              <p className='text-[11px] text-slate-500 font-mono'>
                Barcode: <span className='font-semibold'>{log.barcode}</span>
              </p>
            )}
          </div>
          <button
            type='button'
            onClick={onClose}
            className='p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer'
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className='p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5'>
          {/* Metadata Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs'>
            <div>
              <p className='text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1'>
                Performed By
              </p>
              <LogUserBadge name={log.userName} email={log.userEmail} role={log.userRole} />
            </div>
            <div>
              <p className='text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1'>
                Timestamp
              </p>
              <div className='flex items-center gap-1.5 font-semibold text-slate-700 mt-1 text-xs'>
                <Clock size={13} className='text-slate-400 shrink-0' />
                <span>{formatDate(log.createdAt, 'DD MMM YYYY, HH:mm')}</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          {log.details?.summary && (
            <div className='p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100/80 text-xs text-indigo-900 font-medium'>
              <span className='font-bold mr-1'>Summary:</span>
              {log.details.summary}
            </div>
          )}

          {/* Changes Field Diff */}
          {hasChanges ? (
            <div className='space-y-2'>
              <h4 className='text-[11px] font-bold uppercase tracking-wider text-slate-500'>
                Modified Attributes ({changes.length})
              </h4>
              <div className='border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100'>
                {changes.map((c, i) => (
                  <div key={i} className='p-3 bg-white text-xs flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-1.5 sm:gap-2'>
                    <span className='font-bold text-slate-800 text-[11px] sm:text-xs'>{c.label}</span>
                    <div className='sm:col-span-2 flex items-center gap-2 min-w-0'>
                      <span className='px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-mono text-[10px] sm:text-[11px] line-through truncate max-w-[45%]'>
                        {String(c.oldValue ?? 'None')}
                      </span>
                      <ArrowRight size={12} className='text-slate-400 shrink-0' />
                      <span className='px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold font-mono text-[10px] sm:text-[11px] truncate max-w-[45%]'>
                        {String(c.newValue ?? 'None')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500 font-medium'>
              {log.action === 'CREATE'
                ? 'Product was newly created into the catalog.'
                : log.action === 'DELETE'
                  ? 'Product was completely deleted from catalog.'
                  : 'No specific field diffs recorded.'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50 flex justify-end'>
          <button
            type='button'
            onClick={onClose}
            className='w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition active:scale-98 cursor-pointer text-center'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
