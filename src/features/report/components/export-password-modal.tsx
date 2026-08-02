import { useState } from 'react';
import { Eye, EyeOff, Lock, ShieldCheck, X } from 'lucide-react';

interface Props {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onExport: (password?: string) => void;
  readonly exportType: 'EXCEL' | 'MONTH_CSV' | 'TODAY_CSV';
}

export function ExportPasswordModal({
  isOpen,
  onClose,
  onExport,
  exportType,
}: Props) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const typeLabels = {
    EXCEL: 'Excel Report (.xlsx)',
    MONTH_CSV: 'Monthly Sales Report (.csv)',
    TODAY_CSV: "Today's Sales & Net Profit (.csv)",
  };

  const handleExportWithPassword = () => {
    onExport(password);
    setPassword('');
    onClose();
  };

  const handleExportWithoutPassword = () => {
    onExport(undefined);
    setPassword('');
    onClose();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200'>
      <div className='relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all animate-in zoom-in-95 duration-200'>
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute right-4 top-4 p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition'
        >
          <X size={18} />
        </button>

        {/* Header Icon & Title */}
        <div className='flex items-center gap-3.5'>
          <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs'>
            <Lock size={22} />
          </div>
          <div>
            <h3 className='text-lg font-black text-slate-900 tracking-tight'>
              Protect Export File
            </h3>
            <p className='text-xs font-semibold text-emerald-700'>
              {typeLabels[exportType]}
            </p>
          </div>
        </div>

        <p className='mt-4 text-xs text-slate-500 leading-relaxed font-medium'>
          Enter a password to encrypt this report inside a password-protected
          ZIP archive, or leave blank for a standard direct download.
        </p>

        {/* Password Input Field */}
        <div className='mt-5 space-y-1.5'>
          <label className='text-xs font-extrabold uppercase tracking-wider text-slate-600'>
            File Password (Optional)
          </label>
          <div className='relative flex items-center'>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleExportWithPassword();
              }}
              placeholder='Set password for ZIP file...'
              className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-4 pr-11 py-3 text-sm font-semibold text-slate-800 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3.5 text-slate-400 hover:text-slate-600 transition'
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='mt-6 flex flex-col sm:flex-row items-center gap-2.5 sm:justify-end'>
          <button
            type='button'
            onClick={handleExportWithoutPassword}
            className='w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition cursor-pointer active:scale-95'
          >
            Download Without Password
          </button>
          <button
            type='button'
            onClick={handleExportWithPassword}
            className='w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 transition cursor-pointer active:scale-95'
          >
            <ShieldCheck size={16} />
            <span>
              {password.trim() ? 'Export Protected ZIP' : 'Download File'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
