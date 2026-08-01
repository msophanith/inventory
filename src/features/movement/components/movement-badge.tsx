import { ArrowDownCircle, ArrowUpCircle, RotateCcw } from 'lucide-react';
import type { MovementType } from '../../../services/movement';

interface Props {
  type: MovementType;
}

const MovementTypeBadge = ({ type }: Props) => {
  const config = {
    IN: {
      label: 'IN',
      icon: ArrowDownCircle,
      className: 'bg-blue-100 text-blue-600',
    },

    OUT: {
      label: 'OUT',
      icon: ArrowUpCircle,
      className: 'bg-orange-100 text-orange-600',
    },

    RETURN: {
      label: 'RETURN',
      icon: RotateCcw,
      className: 'bg-purple-100 text-purple-600',
    },
  } satisfies Record<
    MovementType,
    {
      label: string;
      icon: React.ElementType;
      className: string;
    }
  >;

  const item = config[type];

  const Icon = item.icon;

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${item.className}
      `}
    >
      <Icon size={14} />

      {item.label}
    </span>
  );
};

export default MovementTypeBadge;
