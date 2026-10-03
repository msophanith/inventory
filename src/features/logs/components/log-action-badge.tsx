import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { ActivityAction } from '@/services/activity-log.types';

interface Props {
  action: ActivityAction;
}

export function LogActionBadge({ action }: Props) {
  if (action === 'CREATE') {
    return (
      <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs'>
        <Plus size={13} className='stroke-[2.5]' />
        <span>Created</span>
      </span>
    );
  }

  if (action === 'UPDATE') {
    return (
      <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60 shadow-2xs'>
        <Pencil size={12} className='stroke-[2.5]' />
        <span>Edited</span>
      </span>
    );
  }

  return (
    <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/60 shadow-2xs'>
      <Trash2 size={12} className='stroke-[2.5]' />
      <span>Deleted</span>
    </span>
  );
}
