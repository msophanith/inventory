const ProductInfoSkeleton = () => {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-800 to-slate-900 p-6 shadow-xl"
        >
          {/* Animated shine */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />

          {/* Glow */}
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 blur-xl" />

          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <div className="h-4 w-28 animate-pulse rounded bg-white/10" />

              <div className="mt-4 h-10 w-24 animate-pulse rounded bg-white/15" />

              <div className="mt-4 h-3 w-36 animate-pulse rounded bg-white/10" />
            </div>

            <div className="h-14 w-14 animate-pulse rounded-2xl bg-white/10" />
          </div>

          <div className="relative mt-10 flex items-center justify-between">
            <div className="h-7 w-20 animate-pulse rounded-full bg-white/10" />

            <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductInfoSkeleton;