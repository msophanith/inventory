const SKELETON_BG = [
  'bg-linear-to-br from-emerald-50/90 via-emerald-50/40 to-white border-emerald-200/80',
  'bg-linear-to-br from-indigo-50/90 via-indigo-50/40 to-white border-indigo-200/80',
  'bg-linear-to-br from-amber-50/90 via-amber-50/40 to-white border-amber-200/80',
  'bg-linear-to-br from-rose-50/90 via-rose-50/40 to-white border-rose-200/80',
];

export function KpiCardsSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`relative overflow-hidden rounded-3xl border p-5 shadow-xs ${SKELETON_BG[i]}`}
        >
          <div className='flex items-center justify-between'>
            <div className='h-3.5 w-24 animate-pulse rounded-full bg-slate-200' />
            <div className='h-11 w-11 animate-pulse rounded-2xl bg-slate-100' />
          </div>
          <div className='mt-3 space-y-2'>
            <div className='h-7 w-32 animate-pulse rounded-lg bg-slate-200' />
            <div className='h-4 w-20 animate-pulse rounded-md bg-slate-100' />
          </div>
          <div className='mt-4 flex items-center justify-between border-t border-slate-100 pt-3'>
            <div className='h-3 w-24 animate-pulse rounded-full bg-slate-100' />
            <div className='h-4 w-12 animate-pulse rounded-full bg-slate-100' />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SalesSectionSkeleton() {
  return (
    <div className='rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-5'>
      <div className='flex items-center justify-between pb-4 border-b border-slate-100'>
        <div className='flex items-center gap-3'>
          <div className='h-11 w-11 animate-pulse rounded-2xl bg-slate-100' />
          <div className='space-y-1.5'>
            <div className='h-5 w-36 animate-pulse rounded-full bg-slate-200' />
            <div className='h-3 w-48 animate-pulse rounded-full bg-slate-100' />
          </div>
        </div>
        <div className='h-7 w-24 animate-pulse rounded-xl bg-slate-100' />
      </div>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className='h-36 animate-pulse rounded-3xl bg-slate-50 border border-slate-100' />
        ))}
      </div>
    </div>
  );
}

export function AnalyticsGridSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
      {[0, 1].map((col) => (
        <div key={col} className='rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4'>
          <div className='flex items-center justify-between border-b border-slate-100 pb-4'>
            <div className='flex items-center gap-3'>
              <div className='h-10 w-10 animate-pulse rounded-2xl bg-slate-100' />
              <div className='space-y-1.5'>
                <div className='h-4 w-32 animate-pulse rounded-full bg-slate-200' />
                <div className='h-3 w-40 animate-pulse rounded-full bg-slate-100' />
              </div>
            </div>
          </div>
          <div className='h-60 w-full animate-pulse rounded-2xl bg-slate-100/70' />
        </div>
      ))}
    </div>
  );
}

export function OperationsGridSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
      {[0, 1].map((col) => (
        <div key={col} className='rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4'>
          <div className='flex items-center justify-between border-b border-slate-100 pb-4'>
            <div className='flex items-center gap-3'>
              <div className='h-10 w-10 animate-pulse rounded-2xl bg-slate-100' />
              <div className='space-y-1.5'>
                <div className='h-4 w-32 animate-pulse rounded-full bg-slate-200' />
                <div className='h-3 w-40 animate-pulse rounded-full bg-slate-100' />
              </div>
            </div>
          </div>
          <div className='space-y-3'>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className='h-12 animate-pulse rounded-2xl bg-slate-50 border border-slate-100/60' />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className='space-y-6 sm:space-y-8'>
      <SalesSectionSkeleton />
      <KpiCardsSkeleton />
      <AnalyticsGridSkeleton />
      <OperationsGridSkeleton />
    </div>
  );
}

export default DashboardSkeleton;
