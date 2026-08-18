import { useMemo } from 'react';
import { Trophy } from 'lucide-react';
import type { Movement } from '../../../services/movement';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';

interface Props {
  readonly movements?: Movement[];
  readonly isLoading?: boolean;
}

interface SellerItem {
  productId: string;
  name: string;
  category: string;
  qtySold: number;
  revenue: number;
}

const RANK_COLORS = [
  'from-amber-400 to-yellow-300',
  'from-slate-400 to-slate-300',
  'from-orange-400 to-amber-300',
  'from-indigo-400 to-blue-300',
  'from-emerald-400 to-teal-300',
];

const RANK_TEXT = ['text-amber-700', 'text-slate-600', 'text-orange-700', 'text-indigo-700', 'text-emerald-700'];

function aggregateTopSellers(movements: Movement[]): SellerItem[] {
  const map = new Map<string, SellerItem>();

  movements.forEach((m) => {
    if (m.type !== 'OUT' || m.isDamaged || !m.product) return;
    const id = m.productId || m.product.id;
    const qty = Math.abs(m.quantity || 0);
    const rev = qty * (m.unitPrice ?? m.product.sellPrice ?? 0);

    const existing = map.get(id) ?? {
      productId: id,
      name: m.product.name,
      category: m.product.category || 'General',
      qtySold: 0,
      revenue: 0,
    };
    existing.qtySold += qty;
    existing.revenue += rev;
    map.set(id, existing);
  });

  return Array.from(map.values())
    .sort((a, b) => b.qtySold - a.qtySold)
    .slice(0, 5);
}

export function DashboardTopSellers({ movements = [], isLoading }: Props) {
  const sellers = useMemo(() => aggregateTopSellers(movements), [movements]);
  const maxQty = sellers[0]?.qtySold || 1;

  if (isLoading) {
    return <div className='animate-pulse h-72 rounded-3xl bg-slate-100' />;
  }

  return (
    <div className='rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-4'>
      <div className='flex items-center gap-2.5 border-b border-slate-100 pb-4'>
        <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600'>
          <Trophy size={18} />
        </div>
        <div>
          <h2 className='font-extrabold text-slate-900 text-sm'>Top 5 Best Sellers</h2>
          <p className='text-[11px] text-slate-500'>Ranked by units sold (all time)</p>
        </div>
      </div>

      {sellers.length === 0 ? (
        <p className='py-8 text-center text-xs text-slate-400 font-semibold'>No sales data yet.</p>
      ) : (
        <div className='space-y-3'>
          {sellers.map((item, i) => (
            <div key={item.productId} className='flex items-center gap-3'>
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${RANK_COLORS[i]} text-white text-xs font-black shadow-sm`}>
                {i + 1}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between mb-1'>
                  <span className='text-xs font-bold text-slate-900 truncate'>{item.name}</span>
                  <span className={`text-[11px] font-extrabold shrink-0 ml-2 ${RANK_TEXT[i]}`}>{item.qtySold} sold</span>
                </div>
                <div className='relative h-1.5 w-full rounded-full bg-slate-100 overflow-hidden'>
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${RANK_COLORS[i]} transition-all duration-700`}
                    style={{ width: `${(item.qtySold / maxQty) * 100}%` }}
                  />
                </div>
                <p className='mt-1 text-[10px] text-slate-400 font-medium'>
                  {formatCurrencyUsd(item.revenue)}
                  <span className='text-indigo-500 ml-1'>{formatCurrencyKhr(item.revenue)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
