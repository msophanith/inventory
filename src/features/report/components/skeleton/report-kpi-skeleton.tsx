const SKELETON_CARDS = [
  {
    bg: 'bg-linear-to-br from-emerald-50/90 via-emerald-50/40 to-white border-emerald-200/80',
    glow: 'bg-emerald-500/10',
    icon: 'bg-emerald-100/80 border-emerald-200/80',
    badge: 'bg-emerald-100/70 border-emerald-200/70',
  },
  {
    bg: 'bg-linear-to-br from-indigo-50/90 via-indigo-50/40 to-white border-indigo-200/80',
    glow: 'bg-indigo-500/10',
    icon: 'bg-indigo-100/80 border-indigo-200/80',
    badge: 'bg-indigo-100/70 border-indigo-200/70',
  },
  {
    bg: 'bg-linear-to-br from-emerald-50/90 via-teal-50/40 to-white border-emerald-200/80',
    glow: 'bg-teal-500/10',
    icon: 'bg-teal-100/80 border-teal-200/80',
    badge: 'bg-teal-100/70 border-teal-200/70',
  },
  {
    bg: 'bg-linear-to-br from-rose-50/90 via-orange-50/40 to-white border-rose-200/80',
    glow: 'bg-rose-500/10',
    icon: 'bg-rose-100/80 border-rose-200/80',
    badge: 'bg-rose-100/70 border-rose-200/70',
  },
];

export function ReportKpiSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {SKELETON_CARDS.map((card, i) => (
        <div
          key={i}
          className={`relative overflow-hidden rounded-3xl border p-5 shadow-xs ${card.bg}`}
        >
          {/* Ambient background blob */}
          <div
            className={`pointer-events-none absolute -right-6 -bottom-6 h-32 w-32 rounded-full ${card.glow} blur-2xl`}
          />

          <div className='flex items-center justify-between'>
            <div className='h-3.5 w-28 animate-pulse rounded-full bg-slate-300/70' />
            <div
              className={`h-11 w-11 animate-pulse rounded-2xl border ${card.icon}`}
            />
          </div>

          <div className='mt-2.5 space-y-1.5'>
            <div className='h-8 w-32 animate-pulse rounded-lg bg-slate-300/80' />
            <div className='h-4 w-24 animate-pulse rounded-md bg-slate-200/80' />
          </div>

          <div className='mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3'>
            <div className='h-3.5 w-24 animate-pulse rounded-full bg-slate-200' />
            <div
              className={`h-5 w-20 animate-pulse rounded-full border ${card.badge}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

