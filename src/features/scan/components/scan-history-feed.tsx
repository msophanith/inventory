import { ArrowRight, CheckCircle2, History, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ScanHistoryItem {
  id: string;
  barcode: string;
  productName?: string;
  productId?: string;
  found: boolean;
  timestamp: Date;
}

interface Props {
  readonly history: ScanHistoryItem[];
  readonly onClearHistory: () => void;
}

export function ScanHistoryFeed({ history, onClearHistory }: Props) {
  const navigate = useNavigate();

  if (history.length === 0) return null;

  return (
    <div className='rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-3.5'>
      <div className='flex items-center justify-between border-b border-slate-100 pb-3'>
        <div className='flex items-center gap-2'>
          <History size={18} className='text-indigo-600' />
          <h2 className='font-extrabold text-slate-900 text-sm'>
            Recent Scan Audit Feed
          </h2>
        </div>
        <button
          type='button'
          onClick={onClearHistory}
          className='text-xs font-bold text-slate-400 hover:text-slate-600 transition cursor-pointer'
        >
          Clear feed
        </button>
      </div>

      <div className='space-y-2 max-h-64 overflow-y-auto pr-1'>
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (item.found && item.productId) {
                navigate(`/products/${item.productId}`);
              } else {
                navigate(`/products/create?barcode=${encodeURIComponent(item.barcode)}`);
              }
            }}
            className='flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3 hover:bg-slate-100/80 transition cursor-pointer'
          >
            <div className='flex items-center gap-2.5 min-w-0'>
              {item.found ? (
                <CheckCircle2 size={18} className='text-emerald-500 shrink-0' />
              ) : (
                <PlusCircle size={18} className='text-amber-500 shrink-0' />
              )}
              <div className='min-w-0'>
                <p className='font-bold text-xs text-slate-900 truncate'>
                  {item.found ? item.productName : `New Barcode: "${item.barcode}"`}
                </p>
                <p className='text-[10px] text-slate-400 font-mono'>
                  {item.barcode} • {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-1 shrink-0'>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                  item.found
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {item.found ? 'Found' : 'Create'}
              </span>
              <ArrowRight size={14} className='text-slate-400' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
