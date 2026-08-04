import { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Props {
  type: ToastType;
  message: string;
  onClose?: () => void;
  duration?: number;
}

const config = {
  success: {
    icon: CheckCircle2,
    accent: 'bg-emerald-500',
    iconColor: 'text-emerald-500',
    bgColor: 'bg-emerald-50/90 border-emerald-200 text-emerald-950',
  },
  error: {
    icon: XCircle,
    accent: 'bg-rose-500',
    iconColor: 'text-rose-500',
    bgColor: 'bg-rose-50/90 border-rose-200 text-rose-950',
  },
  warning: {
    icon: AlertTriangle,
    accent: 'bg-amber-500',
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-50/90 border-amber-200 text-amber-950',
  },
  info: {
    icon: Info,
    accent: 'bg-indigo-500',
    iconColor: 'text-indigo-500',
    bgColor: 'bg-indigo-50/90 border-indigo-200 text-indigo-950',
  },
};

export function Toast({ type, message, onClose, duration = 3500 }: Props) {
  const currentConfig = config[type] || config.info;
  const Icon = currentConfig.icon;

  useEffect(() => {
    if (!duration || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className='fixed top-5 right-5 z-[9999] max-w-sm w-full pointer-events-auto animate-in slide-in-from-top-4 fade-in duration-300'>
      <div
        className={`relative flex items-center gap-3 overflow-hidden rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all ${currentConfig.bgColor}`}
      >
        {/* Left Color Accent Bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${currentConfig.accent}`} />

        {/* Icon */}
        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 shadow-2xs'>
          <Icon size={20} className={currentConfig.iconColor} />
        </div>

        {/* Content */}
        <div className='flex-1 min-w-0 pr-2'>
          <h4 className='text-xs font-black uppercase tracking-wider opacity-75'>
            {type}
          </h4>
          <p className='text-xs font-bold leading-snug mt-0.5 text-slate-800 break-words'>
            {message}
          </p>
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            type='button'
            onClick={onClose}
            aria-label='Close notification'
            className='rounded-lg p-1 text-slate-400 hover:bg-black/10 hover:text-slate-700 transition cursor-pointer shrink-0'
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

// Backwards compatibility alias for Alert
export default Toast;
