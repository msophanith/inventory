import { ShieldAlert } from 'lucide-react';
import type { ActivityLog } from '@/services/activity-log.types';
import { LogTableHead } from './log-table-head';
import { LogTableRow } from './log-table-row';

interface Props {
  logs: ActivityLog[];
  isLoading?: boolean;
  onViewDetails: (log: ActivityLog) => void;
}

export function LogTableDesktop({ logs, isLoading, onViewDetails }: Props) {
  return (
    <div className='hidden md:block bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <LogTableHead />
          <tbody className='divide-y divide-slate-100'>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className='animate-pulse border-b border-slate-100'>
                  <td className='px-4 py-4'>
                    <div className='h-6 w-20 bg-slate-100 rounded-full' />
                  </td>
                  <td className='px-4 py-4'>
                    <div className='h-4 w-36 bg-slate-100 rounded-md mb-1.5' />
                    <div className='h-3 w-24 bg-slate-100 rounded-md' />
                  </td>
                  <td className='px-4 py-4'>
                    <div className='h-4 w-48 bg-slate-100 rounded-md' />
                  </td>
                  <td className='px-4 py-4'>
                    <div className='h-7 w-32 bg-slate-100 rounded-xl' />
                  </td>
                  <td className='px-4 py-4'>
                    <div className='h-4 w-28 bg-slate-100 rounded-md' />
                  </td>
                  <td className='px-4 py-4 text-right'>
                    <div className='h-7 w-16 bg-slate-100 rounded-xl ml-auto' />
                  </td>
                </tr>
              ))
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className='p-12 text-center'>
                  <div className='max-w-sm mx-auto space-y-2'>
                    <div className='h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto'>
                      <ShieldAlert size={24} />
                    </div>
                    <p className='font-bold text-slate-800 text-sm'>
                      No Product Activity Logs Found
                    </p>
                    <p className='text-xs text-slate-400'>
                      Actions performed on products (create, edit, delete) will appear here in real-time.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <LogTableRow
                  key={log.id}
                  log={log}
                  onViewDetails={onViewDetails}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
