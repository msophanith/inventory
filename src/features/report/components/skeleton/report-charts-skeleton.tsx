const STACKED_BARS = [
  { total: '70%', emerald: '50%', indigo: '38%', rose: '12%' },
  { total: '88%', emerald: '55%', indigo: '35%', rose: '10%' },
  { total: '45%', emerald: '48%', indigo: '42%', rose: '10%' },
  { total: '92%', emerald: '58%', indigo: '34%', rose: '8%' },
  { total: '65%', emerald: '52%', indigo: '38%', rose: '10%' },
  { total: '80%', emerald: '54%', indigo: '36%', rose: '10%' },
  { total: '60%', emerald: '50%', indigo: '40%', rose: '10%' },
];

const SALES_MARGIN_TILES = [
  { border: 'border-indigo-100', bg: 'bg-linear-to-br from-indigo-50/70 to-blue-50/30' },
  { border: 'border-emerald-100', bg: 'bg-linear-to-br from-emerald-50/70 to-teal-50/30' },
  { border: 'border-rose-100', bg: 'bg-linear-to-br from-rose-50/70 to-red-50/30' },
  { border: 'border-amber-100', bg: 'bg-linear-to-br from-amber-50/70 to-orange-50/30' },
];

export function ReportChartsSkeleton() {
  return (
    <div className='space-y-6'>
      {/* 1. Revenue vs COGS Chart Card Skeleton */}
      <div className='rounded-3xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 shadow-xs backdrop-blur-md space-y-5'>
        <div className='flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4'>
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10 animate-pulse rounded-2xl bg-emerald-50 border border-emerald-100' />
            <div className='space-y-1.5'>
              <div className='h-4 w-40 animate-pulse rounded-full bg-slate-200' />
              <div className='h-3 w-56 animate-pulse rounded-full bg-slate-100' />
            </div>
          </div>
          <div className='flex items-center gap-3'>
            {[
              { dot: 'bg-emerald-400', w: 'w-16' },
              { dot: 'bg-indigo-400', w: 'w-20' },
              { dot: 'bg-rose-400', w: 'w-20' },
            ].map((leg, i) => (
              <div key={i} className='flex items-center gap-1.5'>
                <div className={`h-2.5 w-2.5 rounded-full ${leg.dot} animate-pulse`} />
                <div className={`h-3 ${leg.w} rounded-full bg-slate-100 animate-pulse`} />
              </div>
            ))}
          </div>
        </div>

        {/* Stacked bar chart skeleton */}
        <div className='h-64 flex items-end justify-between gap-3 sm:gap-6 px-4 pb-2 border-b border-slate-100'>
          {STACKED_BARS.map((bar, i) => (
            <div key={i} className='flex-1 flex flex-col justify-end items-center gap-2 h-full'>
              <div
                style={{ height: bar.total }}
                className='w-full max-w-[38px] flex flex-col justify-end overflow-hidden rounded-t-lg'
              >
                <div style={{ height: bar.emerald }} className='w-full bg-emerald-200/70 animate-pulse' />
                <div style={{ height: bar.indigo }} className='w-full bg-indigo-200/60 animate-pulse' />
                <div style={{ height: bar.rose }} className='w-full bg-rose-200/60 animate-pulse' />
              </div>
              <div className='h-2.5 w-8 rounded-full bg-slate-100 animate-pulse' />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Sales vs Margin Breakdown Chart Card Skeleton */}
      <div className='rounded-3xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 shadow-xs backdrop-blur-md space-y-6'>
        <div className='flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4'>
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10 animate-pulse rounded-2xl bg-indigo-50 border border-indigo-100' />
            <div className='space-y-1.5'>
              <div className='h-4 w-48 animate-pulse rounded-full bg-slate-200' />
              <div className='h-3 w-64 animate-pulse rounded-full bg-slate-100' />
            </div>
          </div>
          <div className='flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1 border border-slate-200/60'>
            <div className='h-7 w-16 rounded-xl bg-white shadow-xs animate-pulse' />
            <div className='h-7 w-14 rounded-xl bg-transparent animate-pulse' />
            <div className='h-7 w-18 rounded-xl bg-transparent animate-pulse' />
          </div>
        </div>

        {/* 4 Themed Overview Metric Cards */}
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          {SALES_MARGIN_TILES.map((t, i) => (
            <div key={i} className={`rounded-2xl border p-4 space-y-1.5 ${t.border} ${t.bg}`}>
              <div className='h-3 w-24 animate-pulse rounded-full bg-slate-300/60' />
              <div className='h-6 w-32 animate-pulse rounded-md bg-slate-300/70' />
              <div className='h-3.5 w-20 animate-pulse rounded-md bg-slate-200/60' />
            </div>
          ))}
        </div>

        {/* Paired bar chart skeleton */}
        <div className='h-56 flex items-end justify-between gap-3 sm:gap-6 px-4 pb-2 border-b border-slate-100'>
          {STACKED_BARS.map((bar, i) => (
            <div key={i} className='flex-1 flex flex-col justify-end items-center gap-2 h-full'>
              <div className='flex items-end gap-1 w-full max-w-[40px] h-full justify-center'>
                <div style={{ height: bar.total }} className='w-1/2 rounded-t-md bg-indigo-200/60 animate-pulse' />
                <div style={{ height: bar.emerald }} className='w-1/2 rounded-t-md bg-emerald-200/60 animate-pulse' />
              </div>
              <div className='h-2.5 w-8 rounded-full bg-slate-100 animate-pulse' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

