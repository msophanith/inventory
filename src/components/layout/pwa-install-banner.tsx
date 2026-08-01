import { useEffect, useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    setShowBanner(false);
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  if (!showBanner || !deferredPrompt) return null;

  return (
    <div className='fixed bottom-20 lg:bottom-6 right-4 z-50 max-w-sm w-full animate-in slide-in-from-bottom duration-300'>
      <div className='flex items-center justify-between gap-3 rounded-2xl bg-slate-900/95 p-4 text-white shadow-2xl backdrop-blur-md border border-slate-700/60'>
        <div className='flex items-center gap-3 min-w-0'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0 border border-indigo-500/30'>
            <Smartphone size={20} />
          </div>
          <div className='min-w-0'>
            <p className='text-xs font-bold text-slate-100 truncate'>Install Inventory POS App</p>
            <p className='text-[11px] text-slate-400 font-medium truncate'>
              Install for instant offline & barcode access
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2 shrink-0'>
          <button
            type='button'
            onClick={handleInstallClick}
            className='flex items-center gap-1 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-sm hover:from-blue-600 hover:to-indigo-700 cursor-pointer active:scale-95 transition'
          >
            <Download size={14} />
            <span>Install</span>
          </button>
          <button
            type='button'
            onClick={() => setShowBanner(false)}
            className='rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer'
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
