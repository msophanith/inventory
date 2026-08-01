import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface Props {
  type: AlertType;
  message: string;
  onClose?: () => void;
}

const config = {
  success: {
    icon: CheckCircle,
    className: 'border-green-200 bg-green-50 text-green-700 shadow-green-100',
  },

  error: {
    icon: XCircle,
    className: 'border-red-200 bg-red-50 text-red-700 shadow-red-100',
  },

  warning: {
    icon: AlertTriangle,
    className:
      'border-yellow-200 bg-yellow-50 text-yellow-700 shadow-yellow-100',
  },

  info: {
    icon: Info,
    className: 'border-blue-200 bg-blue-50 text-blue-700 shadow-blue-100',
  },
};

const Alert = ({ type, message, onClose }: Props) => {
  const Icon = config[type].icon;

  return (
    <div
      className='
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/30 backdrop-blur-sm
        animate-in fade-in duration-200
      '
    >
      <div
        className={`
          relative
          w-[90%]
          max-w-md
          rounded-2xl
          border
          p-6
          shadow-2xl
          animate-in zoom-in-95 duration-200
          ${config[type].className}
        `}
      >
        {onClose && (
          <button
            onClick={onClose}
            className='
              absolute
              right-3
              top-3
              rounded-full
              p-2
              transition
              hover:bg-black/10
            '
          >
            <X size={18} />
          </button>
        )}

        <div className='flex flex-col items-center text-center'>
          <div
            className='
              mb-4
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-white
              shadow-md
            '
          >
            <Icon size={36} />
          </div>

          <h3 className='mb-2 text-lg font-semibold capitalize'>{type}</h3>

          <p className='text-sm leading-6'>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Alert;
