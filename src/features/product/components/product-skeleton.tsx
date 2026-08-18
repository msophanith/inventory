// Icon accent colours match the 4 real KPI cards in dashboard-kpi-cards.tsx
const CARD_ACCENTS = [
  { icon: 'bg-emerald-50', bar: 'bg-emerald-200/60' },
  { icon: 'bg-blue-50',    bar: 'bg-blue-200/60'    },
  { icon: 'bg-indigo-50',  bar: 'bg-indigo-200/60'  },
  { icon: 'bg-rose-100',   bar: 'bg-rose-200/60'    },
];

const ProductInfoSkeleton = () => {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {CARD_ACCENTS.map((accent, index) => {
        const isAlert = index === 3;
        return (
          <div
            key={index}
            className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${
              isAlert
                ? 'border-rose-200/80 bg-rose-50/40'
                : 'border-slate-200/80 bg-white'
            }`}
          >
            {/* Shimmer sweep */}
            <div className='absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-slate-100/80 to-transparent' />

            {/* Header row: label + icon box */}
            <div className='relative flex items-center justify-between'>
              <div className='h-3 w-24 animate-pulse rounded-full bg-slate-200' />
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${accent.icon}`}>
                <div className='h-5 w-5 animate-pulse rounded-lg bg-slate-200' />
              </div>
            </div>

            {/* Value block */}
            <div className='relative mt-3 space-y-1.5'>
              <div className='h-7 w-28 animate-pulse rounded-lg bg-slate-200' />
              <div className='h-3 w-20 animate-pulse rounded-full bg-slate-100' />
            </div>

            {/* Footer row */}
            <div className='relative mt-3 flex items-center justify-between'>
              <div className={`h-3 w-20 animate-pulse rounded-full ${accent.bar}`} />
              <div className={`h-5 w-12 animate-pulse rounded-full ${accent.bar}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductInfoSkeleton;