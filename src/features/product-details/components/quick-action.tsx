import { ArrowDownToLine, ArrowUpFromLine, RotateCcw } from 'lucide-react';

interface Props {
  readonly onStockIn: () => void;
  readonly onStockOut: () => void;
  readonly onReturn: () => void;
  readonly isLoading?: boolean;
}

const QuickActions = ({ onStockIn, onStockOut, onReturn, isLoading }: Props) => {
  const actions = [
    {
      label: 'Stock In',
      icon: ArrowDownToLine,
      className: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20',
      action: onStockIn,
    },
    {
      label: 'Stock Out',
      icon: ArrowUpFromLine,
      className: 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20',
      action: onStockOut,
    },
    {
      label: 'Return',
      icon: RotateCcw,
      className: 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20',
      action: onReturn,
    },
  ];

  return (
    <div className='rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-4 min-w-0 w-full'>
      <h2 className='font-bold text-slate-900 text-base'>Quick Stock Actions</h2>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              disabled={isLoading}
              onClick={item.action}
              className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-extrabold text-white shadow-md transition cursor-pointer active:scale-98 disabled:opacity-50 ${item.className}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
