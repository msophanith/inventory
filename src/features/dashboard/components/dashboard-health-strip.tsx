import { CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { useLanguage } from '@/i18n/language-context';

interface Props {
  readonly totalItems: number;
  readonly lowStock: number;
  readonly outOfStock: number;
}

export function DashboardHealthStrip({
  totalItems,
  lowStock,
  outOfStock,
}: Props) {
  const { t } = useLanguage();

  const healthyCount = Math.max(0, totalItems - (lowStock + outOfStock));
  const healthyPct =
    totalItems > 0 ? Math.round((healthyCount / totalItems) * 100) : 0;
  const lowPct = totalItems > 0 ? Math.round((lowStock / totalItems) * 100) : 0;
  const outPct =
    totalItems > 0 ? Math.round((outOfStock / totalItems) * 100) : 0;

  return (
    <div className='rounded-2xl border border-slate-200/70 bg-white/70 p-3.5 backdrop-blur-xs shadow-2xs space-y-2.5'>
      <div className='flex items-center justify-between text-xs'>
        <span className='font-extrabold text-slate-700 tracking-tight'>
          {t('reports.stockDistribution')}
        </span>
        <div className='flex items-center gap-3 text-[11px] font-bold'>
          <span className='flex items-center gap-1 text-emerald-700'>
            <CheckCircle2 size={12} className='text-emerald-500' />
            {healthyCount} ({healthyPct}%)
          </span>
          <span className='flex items-center gap-1 text-amber-700'>
            <AlertTriangle size={12} className='text-amber-500' />
            {lowStock} ({lowPct}%)
          </span>
          <span className='flex items-center gap-1 text-rose-700'>
            <AlertOctagon size={12} className='text-rose-500' />
            {outOfStock} ({outPct}%)
          </span>
        </div>
      </div>

      <div className='flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner'>
        <div
          style={{ width: `${healthyPct}%` }}
          className='h-full bg-emerald-500 transition-all duration-700'
          title={`Healthy: ${healthyCount} (${healthyPct}%)`}
        />
        <div
          style={{ width: `${lowPct}%` }}
          className='h-full bg-amber-400 transition-all duration-700'
          title={`Low Stock: ${lowStock} (${lowPct}%)`}
        />
        <div
          style={{ width: `${outPct}%` }}
          className='h-full bg-rose-500 transition-all duration-700'
          title={`Out of Stock: ${outOfStock} (${outPct}%)`}
        />
      </div>
    </div>
  );
}
