import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ScrollText, Calendar, Eye, ShieldCheck } from 'lucide-react';
import { activityLogService } from '@/services';
import type { ActivityLog } from '@/services/activity-log.types';
import { formatDate } from '@/utils/date';
import { LogActionBadge } from '@/features/logs/components/log-action-badge';
import { LogUserBadge } from '@/features/logs/components/log-user-badge';
import { LogDiffModal } from '@/features/logs/components/log-diff-modal';

interface Props {
  productId: string;
}

export default function ProductActivityLogs({ productId }: Props) {
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['product-activity-logs', productId],
    queryFn: () => activityLogService.getByProductId(productId),
    enabled: !!productId,
    staleTime: 10 * 1000,
  });

  const handleOpenDetails = (log: ActivityLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  return (
    <section className='rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4 min-w-0 w-full'>
      {/* Header */}
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2.5'>
          <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600'>
            <ScrollText size={18} />
          </div>
          <div>
            <h2 className='font-bold text-slate-900 text-base'>
              Product Activity Logs
            </h2>
            <p className='text-xs text-slate-400 font-medium'>
              Audit trail of who created and edited this product
            </p>
          </div>
        </div>

        <span className='px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700'>
          {logs.length} {logs.length === 1 ? 'event' : 'events'}
        </span>
      </div>

      {/* Logs Content */}
      {isLoading ? (
        <div className='space-y-3'>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className='h-16 rounded-2xl bg-slate-50 animate-pulse' />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className='p-8 rounded-2xl bg-slate-50/70 border border-slate-100 text-center space-y-1.5'>
          <div className='h-10 w-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto'>
            <ShieldCheck size={20} />
          </div>
          <p className='text-xs font-bold text-slate-700'>No activity logs recorded yet</p>
          <p className='text-[11px] text-slate-400'>
            Future modifications to this product will be tracked here.
          </p>
        </div>
      ) : (
        <div className='divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden'>
          {logs.map((log) => {
            const changes = log.details?.changes || [];
            return (
              <div
                key={log.id}
                className='p-3.5 sm:p-4 bg-white hover:bg-slate-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs'
              >
                {/* Left: Action & Info */}
                <div className='flex items-start sm:items-center gap-3 min-w-0 flex-1'>
                  <LogActionBadge action={log.action} />
                  <div className='min-w-0 flex-1 space-y-1'>
                    <p className='font-semibold text-slate-800 text-xs truncate'>
                      {log.details?.summary || `Product ${log.action.toLowerCase()}`}
                    </p>
                    {changes.length > 0 && (
                      <div className='flex flex-wrap gap-1'>
                        {changes.slice(0, 3).map((c, i) => (
                          <span
                            key={i}
                            className='inline-flex items-center gap-1 text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded'
                          >
                            <span className='font-bold'>{c.label}:</span>
                            <span className='text-rose-600 line-through'>{String(c.oldValue ?? '')}</span>
                            <span>→</span>
                            <span className='text-emerald-700 font-bold'>{String(c.newValue ?? '')}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Operator & Timestamp */}
                <div className='flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100'>
                  <LogUserBadge name={log.userName} email={log.userEmail} role={log.userRole} />
                  <div className='flex items-center gap-1 text-[11px] text-slate-400 font-semibold'>
                    <Calendar size={12} />
                    <span>{formatDate(log.createdAt, 'DD MMM, HH:mm')}</span>
                  </div>
                  <button
                    type='button'
                    onClick={() => handleOpenDetails(log)}
                    className='p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer'
                    title='View details'
                  >
                    <Eye size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Diff Modal */}
      <LogDiffModal
        log={selectedLog}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLog(null);
        }}
      />
    </section>
  );
}
