interface Props {
  readonly current: number;
  readonly next: number;
  readonly unit: string;
}

export default function StockPreview({ current, next, unit }: Props) {
  const invalid = next < 0;

  return (
    <div
      className={`rounded-2xl border p-3.5 sm:p-4 transition-colors ${
        invalid
          ? 'border-rose-200 bg-rose-50/80 text-rose-900'
          : 'border-emerald-200 bg-emerald-50/80 text-emerald-900'
      }`}
    >
      <div className='flex items-center justify-between gap-2'>
        <div>
          <p className='text-xs font-semibold text-slate-500'>Current Stock</p>
          <h2 className='text-2xl sm:text-3xl font-extrabold text-slate-900'>
            {current}
          </h2>
        </div>

        <span className='text-xl sm:text-2xl font-bold text-slate-400'>→</span>

        <div className='text-right'>
          <p className='text-xs font-semibold text-slate-500'>New Calculated</p>
          <h2
            className={`text-2xl sm:text-3xl font-extrabold ${
              invalid ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {next}
          </h2>
          <p className='text-[10px] sm:text-xs font-medium text-slate-500'>
            {unit || 'units'}
          </p>
        </div>
      </div>

      {invalid && (
        <p className='mt-2.5 text-xs font-bold text-rose-600 bg-white/60 rounded-xl p-2 text-center border border-rose-200'>
          ⚠️ Quantity exceeds available stock.
        </p>
      )}
    </div>
  );
}
