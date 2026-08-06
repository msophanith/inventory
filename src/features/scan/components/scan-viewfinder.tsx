import { Camera, Search, Sparkles } from 'lucide-react';
import { useLanguage } from '../../../i18n/language-context';

interface Props {
  readonly manualCode: string;
  readonly onManualCodeChange: (val: string) => void;
  readonly onSubmitLookup: (code: string) => void;
  readonly onOpenCamModal: () => void;
  readonly isSearching: boolean;
}

export function ScanViewfinder({
  manualCode,
  onManualCodeChange,
  onSubmitLookup,
  onOpenCamModal,
  isSearching,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className='rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5'>
      {/* Search Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitLookup(manualCode);
        }}
        className='flex items-center gap-2'
      >
        <div className='relative flex-1 min-w-0'>
          <Search
            size={18}
            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
          />
          <input
            type='text'
            value={manualCode}
            onChange={(e) => onManualCodeChange(e.target.value)}
            placeholder={t('products.searchProduct')}
            className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs'
          />
        </div>
        <button
          type='submit'
          disabled={!manualCode.trim() || isSearching}
          className='rounded-2xl bg-slate-900 px-5 py-3 text-xs font-black text-white shadow-md hover:bg-slate-800 disabled:opacity-50 transition cursor-pointer shrink-0'
        >
          {t('common.search')}
        </button>
      </form>

      {/* Visual Camera Scan Trigger & Animated Laser Reticle Card */}
      <div className='relative overflow-hidden rounded-2xl bg-slate-900 p-6 text-center text-white space-y-4 shadow-inner border border-slate-800'>
        {/* Animated Laser Beam */}
        <div className='absolute inset-x-0 top-1/2 h-0.5 bg-linear-to-r from-transparent via-rose-500 to-transparent animate-pulse shadow-[0_0_12px_#f43f5e]' />

        {/* Viewfinder Target Reticle Frame Corners */}
        <div className='relative z-10 mx-auto h-28 w-56 rounded-xl border-2 border-dashed border-indigo-400/40 flex flex-col items-center justify-center p-3 bg-indigo-950/30 backdrop-blur-xs'>
          <Sparkles size={22} className='text-indigo-400 animate-bounce mb-1' />
          <p className='text-xs font-extrabold text-indigo-200'>
            {t('pos.scanBarcode')}
          </p>
          <p className='text-[10px] text-slate-400 font-mono mt-0.5'>
            UPC, EAN-13, QR Code
          </p>
        </div>

        <button
          type='button'
          onClick={onOpenCamModal}
          className='relative z-10 w-full flex items-center justify-center gap-2.5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 transition cursor-pointer active:scale-98'
        >
          <Camera size={18} />
          <span>{t('pos.cameraScanner')}</span>
        </button>
      </div>
    </div>
  );
}
