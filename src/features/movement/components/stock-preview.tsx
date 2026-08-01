interface Props {
  current: number;
  next: number;
  unit: string;
}

export default function StockPreview({ current, next, unit }: Props) {
  const invalid = next < 0;

  return (
    <div
      className={`rounded-2xl border p-4 ${
        invalid
          ? 'border-red-200 bg-red-50'
          : 'border-emerald-200 bg-emerald-50'
      }`}
    >
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-xs text-gray-500'>Current</p>

          <h2 className='text-3xl font-bold'>{current}</h2>
        </div>

        <span className='text-2xl'>→</span>

        <div className='text-right'>
          <p className='text-xs text-gray-500'>New</p>

          <h2 className='text-3xl font-bold'>{next}</h2>

          <p>{unit}</p>
        </div>
      </div>

      {invalid && (
        <p className='mt-3 text-sm text-red-600'>
          Quantity exceeds available stock.
        </p>
      )}
    </div>
  );
}
