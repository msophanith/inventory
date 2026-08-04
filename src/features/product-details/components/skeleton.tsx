import { PageContainer } from '../../../components/layout/page-container';

const ProductDetailsSkeleton = () => {
  return (
    <PageContainer className='space-y-6 animate-pulse'>
      {/* 1. Back Button Skeleton */}
      <div>
        <div className='h-9 w-36 rounded-xl bg-slate-200/80' />
      </div>

      {/* 2. Hero Card Skeleton */}
      <div className='rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-4'>
        <div className='flex flex-col gap-6 md:flex-row md:items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='h-24 w-24 rounded-2xl bg-slate-200/80 shrink-0' />
            <div className='space-y-2.5 flex-1 min-w-0'>
              <div className='h-7 w-56 rounded-lg bg-slate-200/80' />
              <div className='h-4 w-40 rounded-md bg-slate-200/60' />
              <div className='flex gap-2 pt-1'>
                <div className='h-6 w-20 rounded-full bg-slate-200/80' />
                <div className='h-6 w-24 rounded-full bg-slate-200/80' />
              </div>
            </div>
          </div>
          <div className='h-12 w-36 rounded-2xl bg-slate-200/80 shrink-0' />
        </div>
      </div>

      {/* 3. Quick Actions Bar Skeleton */}
      <div className='grid grid-cols-3 gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xs'>
        <div className='h-11 rounded-xl bg-slate-200/80' />
        <div className='h-11 rounded-xl bg-slate-200/80' />
        <div className='h-11 rounded-xl bg-slate-200/80' />
      </div>

      {/* 4. Statistics Metric Cards Grid Skeleton */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className='h-28 rounded-3xl border border-slate-200/80 bg-white p-5 space-y-3'
          >
            <div className='flex justify-between items-center'>
              <div className='h-3 w-20 rounded bg-slate-200/80' />
              <div className='h-8 w-8 rounded-xl bg-slate-200/80' />
            </div>
            <div className='h-6 w-28 rounded-lg bg-slate-200/80' />
          </div>
        ))}
      </div>

      {/* 5. Stock Level Progress Skeleton */}
      <div className='rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-3'>
        <div className='flex justify-between items-center'>
          <div className='h-5 w-36 rounded-lg bg-slate-200/80' />
          <div className='h-5 w-20 rounded-full bg-slate-200/80' />
        </div>
        <div className='h-4 w-full rounded-full bg-slate-200/80' />
      </div>

      {/* 6. Movement History Table Skeleton */}
      <div className='rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-4'>
        <div className='h-6 w-48 rounded-lg bg-slate-200/80' />
        <div className='space-y-2.5'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className='h-12 w-full rounded-xl bg-slate-200/60'
            />
          ))}
        </div>
      </div>

      {/* 7. Product Specifications Info Skeleton */}
      <div className='rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-4'>
        <div className='h-6 w-44 rounded-lg bg-slate-200/80' />
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='h-16 rounded-2xl bg-slate-100 p-4 space-y-2'
            >
              <div className='h-3 w-16 rounded bg-slate-200/80' />
              <div className='h-4 w-28 rounded bg-slate-200/80' />
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default ProductDetailsSkeleton;
