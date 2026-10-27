import { Barcode, DollarSign, Layers, Sparkles, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/i18n/language-context';

export function LoginShowcasePanel() {
  const { t } = useLanguage();

  return (
    <div className='relative hidden lg:flex lg:col-span-7 flex-col justify-between overflow-hidden bg-slate-950 p-12 xl:p-16 text-white'>
      {/* Ambient background glows */}
      <div className='pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]' />
      <div className='pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-indigo-600/15 blur-[140px]' />
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25' />

      {/* Top Header Badge */}
      <div className='relative z-10 flex items-center justify-between'>
        <div className='inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 backdrop-blur-md'>
          <span className='relative flex h-2 w-2'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
            <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-500' />
          </span>
          <span className='text-xs font-semibold tracking-wide text-emerald-300 uppercase'>
            {t('auth.storeEngineOnline')}
          </span>
        </div>
        <span className='font-mono text-xs text-slate-500'>
          v1.0.4 · POS Hub
        </span>
      </div>

      {/* Core Showcase Hero */}
      <div className='relative z-10 my-auto max-w-xl space-y-8'>
        <div className='space-y-4'>
          <div className='inline-flex items-center gap-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300'>
            <Sparkles size={13} className='text-indigo-400' />
            <span>MeanLeap · មានលាភ POS</span>
          </div>
          <h1 className='text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight'>
            Smart Inventory & High-Velocity Retail Terminal.
          </h1>
          <p className='text-sm xl:text-base text-slate-400 leading-relaxed font-normal'>
            {t('auth.showcaseTagline')}
          </p>
        </div>

        {/* Live POS Dual-Currency Telemetry Card */}
        <div className='rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl shadow-2xl'>
          <div className='flex items-center justify-between border-b border-slate-800/80 pb-3'>
            <div className='flex items-center gap-2'>
              <div className='h-2 w-2 rounded-full bg-emerald-400' />
              <span className='font-mono text-xs font-medium text-slate-300'>
                {t('auth.terminalLiveEngine')}
              </span>
            </div>
            <span className='rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-400 border border-emerald-500/20'>
              LIVE READY
            </span>
          </div>

          <div className='mt-4 grid grid-cols-2 gap-4'>
            <div className='rounded-xl bg-slate-950/60 p-3.5 border border-slate-800/60'>
              <div className='flex items-center gap-1.5 text-xs font-semibold text-slate-400'>
                <DollarSign size={13} className='text-emerald-400' />
                <span>Today (USD)</span>
              </div>
              <div className='mt-1 font-mono text-xl font-bold text-white tracking-tight'>
                $1,840.50
              </div>
              <div className='mt-1 flex items-center gap-1 text-[11px] text-emerald-400 font-medium'>
                <TrendingUp size={11} /> +14.2% vs yesterday
              </div>
            </div>

            <div className='rounded-xl bg-slate-950/60 p-3.5 border border-slate-800/60'>
              <div className='flex items-center gap-1.5 text-xs font-semibold text-slate-400'>
                <span className='text-amber-400 font-bold text-xs'>៛</span>
                <span>Today (KHR)</span>
              </div>
              <div className='mt-1 font-mono text-xl font-bold text-amber-300 tracking-tight'>
                7,546,000 ៛
              </div>
              <div className='mt-1 text-[11px] text-slate-400 font-medium'>
                Exchange Rate: 4,100
              </div>
            </div>
          </div>
        </div>

        {/* Feature Badges */}
        <div className='flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300'>
          <div className='flex items-center gap-2 rounded-xl border border-slate-800/90 bg-slate-900/50 px-3 py-2'>
            <DollarSign size={14} className='text-emerald-400' />
            <span>{t('auth.dualCurrencyFeature')}</span>
          </div>
          <div className='flex items-center gap-2 rounded-xl border border-slate-800/90 bg-slate-900/50 px-3 py-2'>
            <Barcode size={14} className='text-indigo-400' />
            <span>{t('auth.fastScanFeature')}</span>
          </div>
          <div className='flex items-center gap-2 rounded-xl border border-slate-800/90 bg-slate-900/50 px-3 py-2'>
            <Layers size={14} className='text-cyan-400' />
            <span>{t('auth.stockAuditFeature')}</span>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Footer */}
      <div className='relative z-10 flex items-center justify-between text-xs text-slate-500 font-mono pt-6 border-t border-slate-900'>
        <span>MeanLeap Cloud Sync · Real-time</span>
        <span>Phnom Penh Timezone (UTC+7)</span>
      </div>
    </div>
  );
}
