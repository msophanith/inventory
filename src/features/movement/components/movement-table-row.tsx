import { useNavigate } from 'react-router-dom';
import type { Movement } from '../../../services/movement';
import { formatDateTime } from '../../../utils/date';
import MovementTypeBadge from './movement-badge';

interface Props {
  readonly item: Movement;
  readonly onClick?: () => void;
}

export function MovementTableRow({ item, onClick }: Props) {
  const navigate = useNavigate();
  const isDamaged = Boolean(
    item.isDamaged || item.reference?.toLowerCase() === 'damage',
  );
  const dateStr = formatDateTime(item.createdAt, 'dd MMM yyyy, HH:mm', '-');

  const stock = item.product?.quantity ?? 0;
  const minStock = item.product?.minStock ?? 0;
  const isOut = stock <= 0;
  const isLow = stock > 0 && stock <= minStock;

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    const targetId = item.productId || item.product?.id;
    if (targetId) {
      navigate(`/products/${targetId}`);
    }
  };

  return (
    <tr
      onClick={handleClick}
      className='hover:bg-slate-50/80 transition-colors cursor-pointer group'
      title={
        item.product?.name
          ? `View ${item.product.name} details`
          : 'View product details'
      }
    >
      {/* Product & Movement ID */}
      <td className='px-5 py-3.5'>
        <p className='font-bold text-slate-900 group-hover:text-indigo-600 transition-colors'>
          {item.product?.name || item.productId}
        </p>
        <p className='text-xs text-slate-400 font-mono'>
          #{item.id.slice(0, 8)}
        </p>
      </td>


      {/* Movement Type */}
      <td className='px-5 py-3.5'>
        <MovementTypeBadge type={item.type} />
      </td>

      {/* Movement Quantity */}
      <td className='px-5 py-3.5 text-center font-extrabold text-slate-900'>
        {item.type === 'OUT'
          ? `-${item.quantity}`
          : item.type === 'RETURN'
            ? `${item.quantity} (Ret)`
            : `+${item.quantity}`}
      </td>

      {/* Remaining Stock Column */}
      <td className='px-5 py-3.5 text-center'>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-black tracking-wide ${
            isOut
              ? 'bg-rose-100 text-rose-700'
              : isLow
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-slate-700'
          }`}
        >
          {isOut ? '0 left (Out)' : `${stock} ${item.product?.unit || 'left'}`}
        </span>
      </td>

      {/* Condition */}
      <td className='px-5 py-3.5'>
        {isDamaged ? (
          <span className='inline-block rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700'>
            Damaged
          </span>
        ) : (
          <span className='inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700'>
            Good
          </span>
        )}
      </td>

      {/* Reference / Note */}
      <td className='px-5 py-3.5 text-xs text-slate-600 font-medium max-w-xs truncate'>
        {item.reference || item.note || '-'}
      </td>

      {/* Date & Time */}
      <td className='px-5 py-3.5 text-right text-xs text-slate-400 font-mono'>
        {dateStr}
      </td>
    </tr>
  );
}
