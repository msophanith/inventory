import { ShieldAlert, PlusCircle, FileEdit, Trash2 } from 'lucide-react';
import type { ActivityLogKPI } from '@/services/activity-log.types';

interface Props {
  kpis: ActivityLogKPI;
  isLoading?: boolean;
}

export function LogKpiCards({ kpis, isLoading }: Props) {
  const cards = [
    {
      title: 'Total Events',
      fullTitle: 'Total Product Events',
      value: kpis.totalLogs,
      icon: ShieldAlert,
      bgLight: 'bg-indigo-50/80 text-indigo-700',
    },
    {
      title: 'Created',
      fullTitle: 'Products Created',
      value: kpis.totalCreated,
      icon: PlusCircle,
      bgLight: 'bg-emerald-50/80 text-emerald-700',
    },
    {
      title: 'Edited',
      fullTitle: 'Products Edited',
      value: kpis.totalUpdated,
      icon: FileEdit,
      bgLight: 'bg-blue-50/80 text-blue-700',
    },
    {
      title: 'Deleted',
      fullTitle: 'Products Deleted',
      value: kpis.totalDeleted,
      icon: Trash2,
      bgLight: 'bg-rose-50/80 text-rose-700',
    },
  ];

  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4'>
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className='bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition duration-200'
          >
            <div className='flex items-center justify-between gap-1.5 sm:gap-2 mb-1.5 sm:mb-3'>
              <span className='text-[11px] sm:text-xs font-bold text-slate-500 truncate'>
                <span className='sm:hidden'>{card.title}</span>
                <span className='hidden sm:inline'>{card.fullTitle}</span>
              </span>
              <div
                className={`h-7 w-7 sm:h-9 sm:w-9 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${card.bgLight}`}
              >
                <Icon size={15} className='sm:w-[18px] sm:h-[18px]' />
              </div>
            </div>
            <p className='text-xl sm:text-3xl font-black text-slate-900 tracking-tight'>
              {isLoading ? '...' : card.value.toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}
