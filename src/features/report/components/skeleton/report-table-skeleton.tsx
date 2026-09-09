export function ReportTableSkeleton() {
  return (
    <div className='space-y-6 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xs backdrop-blur-md'>
      {/* Top Filter & Search Controls */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center rounded-2xl bg-slate-100/90 p-1.5 border border-slate-200/50'>
          <div className='h-9 w-36 rounded-xl bg-white shadow-xs animate-pulse' />
          <div className='h-9 w-44 rounded-xl bg-transparent animate-pulse' />
        </div>
        <div className='h-11 w-full sm:w-80 rounded-2xl bg-slate-100/90 border border-slate-200/60 animate-pulse' />
      </div>

      {/* Table Skeleton */}
      <div className='overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs'>
        <div className='flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-6 py-4'>
          {[
            { w: 'w-[28%]', align: 'text-left' },
            { w: 'w-[14%]', align: 'text-left' },
            { w: 'w-[12%]', align: 'text-center' },
            { w: 'w-[16%]', align: 'text-right' },
            { w: 'w-[16%]', align: 'text-right' },
            { w: 'w-[14%]', align: 'text-right' },
          ].map((col, i) => (
            <div key={i} className={`${col.w} ${col.align}`}>
              <div className='h-3.5 w-20 animate-pulse rounded-full bg-slate-200 inline-block' />
            </div>
          ))}
        </div>

        <div className='divide-y divide-slate-100'>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className='flex items-center justify-between px-6 py-4'>
              {/* Product Info */}
              <div className='w-[28%] flex items-center gap-3'>
                <div className='h-10 w-10 animate-pulse rounded-xl bg-slate-100 border border-slate-200/50 shrink-0' />
                <div className='space-y-1.5'>
                  <div className='h-4 w-36 animate-pulse rounded-full bg-slate-200' />
                  <div className='h-3 w-20 animate-pulse rounded-full bg-slate-100' />
                </div>
              </div>

              {/* Category */}
              <div className='w-[14%]'>
                <div className='h-6 w-20 animate-pulse rounded-full bg-slate-100 border border-slate-200/40' />
              </div>

              {/* Quantity */}
              <div className='w-[12%] text-center'>
                <div className='h-6 w-14 animate-pulse rounded-xl bg-slate-100 mx-auto' />
              </div>

              {/* Total Sales (USD + KHR) */}
              <div className='w-[16%] space-y-1 text-right'>
                <div className='h-4 w-20 animate-pulse rounded-full bg-slate-200 ml-auto' />
                <div className='h-3 w-16 animate-pulse rounded-full bg-slate-100 ml-auto' />
              </div>

              {/* Profit/Cost (USD + KHR) */}
              <div className='w-[16%] space-y-1 text-right'>
                <div className='h-4 w-20 animate-pulse rounded-full bg-slate-200 ml-auto' />
                <div className='h-3 w-16 animate-pulse rounded-full bg-slate-100 ml-auto' />
              </div>

              {/* Margin % */}
              <div className='w-[14%] flex justify-end'>
                <div className='h-6 w-16 animate-pulse rounded-full bg-emerald-50 border border-emerald-100' />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Footer */}
      <div className='flex items-center justify-between pt-2'>
        <div className='h-3.5 w-36 animate-pulse rounded-full bg-slate-200' />
        <div className='flex items-center gap-2'>
          <div className='h-9 w-24 animate-pulse rounded-xl bg-slate-100' />
          <div className='h-9 w-28 animate-pulse rounded-xl bg-slate-100' />
        </div>
      </div>
    </div>
  );
}

