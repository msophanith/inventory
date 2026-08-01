import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  readonly quantity: number;
  readonly minStock: number;
  readonly unit: string;
}

const StockProgress = ({ quantity, minStock, unit }: Props) => {
  const targetStock = Math.max(minStock * 5, 10);
  const percentage = Math.min((quantity / targetStock) * 100, 100);
  const isLow = quantity <= minStock;

  return (
    <div className='rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-4 min-w-0 w-full'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='font-bold text-slate-900 text-base'>Stock Health Status</h2>
          <p className='text-xs text-slate-400 font-medium'>
            Live inventory ratio vs safety thresholds
          </p>
        </div>

        {isLow ? (
          <span className='inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700'>
            <AlertTriangle size={14} />
            Low Stock Alert
          </span>
        ) : (
          <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700'>
            <CheckCircle2 size={14} />
            Healthy Level
          </span>
        )}
      </div>

      {/* Progress Bar Container */}
      <div className='h-3.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 border border-slate-200/60'>
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isLow ? 'bg-rose-500' : 'bg-linear-to-r from-emerald-500 to-teal-400'
          }`}
          style={{ width: `${Math.max(percentage, 3)}%` }}
        />
      </div>

      <div className='flex justify-between text-xs font-bold text-slate-600'>
        <span>
          Current: <span className='text-slate-900'>{quantity} {unit}</span>
        </span>
        <span>
          Safety Limit: <span className='text-slate-900'>{minStock} {unit}</span>
        </span>
      </div>
    </div>
  );
};

export default StockProgress;
