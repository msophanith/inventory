import { useNavigate } from 'react-router-dom';
import type { Movement } from '@/services/movement';
import { formatDateTime } from '@/utils/date';
import MovementTypeBadge from './movement-badge';

interface Props {
  readonly item: Movement;
  readonly onClick?: () => void;
}

export function MovementMobileCard({ item, onClick }: Props) {
  const navigate = useNavigate();
  const isDamaged = Boolean(
    item.isDamaged || item.reference?.toLowerCase() === 'damage',
  );
  const stock = item.product?.quantity ?? 0;
  const minStock = item.product?.minStock ?? 0;
  const isOut = stock <= 0;
  const isLow = stock > 0 && stock <= minStock;

  const qtyDisplay =
    item.type === 'OUT'
      ? `-${item.quantity}`
      : item.type === 'RETURN'
        ? `${item.quantity} (Ret)`
        : `+${item.quantity}`;

  const handleClick = () => {
    if (onClick) { onClick(); return; }
    const id = item.productId || item.product?.id;
    if (id) navigate(`/products/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className='group cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:border-indigo-300 hover:shadow-md active:scale-[0.99] transition-all'
    >
      {/* Top row: product name + type badge */}
      <div className='flex items-start justify-between gap-2 mb-3'>
        <div className='min-w-0'>
          <p className='font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors'>
            {item.product?.name || item.productId}
          </p>
          <p className='text-[11px] text-slate-400 font-mono mt-0.5'>
            #{item.id.slice(0, 8)}
          </p>
        </div>
        <MovementTypeBadge type={item.type} />
      </div>

      {/* Stats grid */}
      <div className='grid grid-cols-3 gap-2 mb-3'>
        <div className='rounded-xl bg-slate-50 px-3 py-2 text-center'>
          <p className='text-[10px] text-slate-400 font-semibold uppercase tracking-wide'>Qty</p>
          <p className='text-sm font-extrabold text-slate-900'>{qtyDisplay}</p>
        </div>
        <div className='rounded-xl bg-slate-50 px-3 py-2 text-center'>
          <p className='text-[10px] text-slate-400 font-semibold uppercase tracking-wide'>Stock</p>
          <span className={`text-xs font-black ${isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-700'}`}>
            {isOut ? '0 (Out)' : `${stock} ${item.product?.unit || ''}`}
          </span>
        </div>
        <div className='rounded-xl bg-slate-50 px-3 py-2 text-center'>
          <p className='text-[10px] text-slate-400 font-semibold uppercase tracking-wide'>Cond.</p>
          <span className={`text-xs font-black ${isDamaged ? 'text-rose-600' : 'text-emerald-600'}`}>
            {isDamaged ? 'Damaged' : 'Good'}
          </span>
        </div>
      </div>

      {/* Bottom row: ref/note + date */}
      <div className='flex items-center justify-between gap-2 text-xs'>
        <p className='text-slate-500 font-medium truncate max-w-[55%]'>
          {item.reference || item.note || '—'}
        </p>
        <p className='text-slate-400 font-mono shrink-0'>
          {formatDateTime(item.createdAt, 'DD MMM, HH:mm')}
        </p>
      </div>
    </div>
  );
}
