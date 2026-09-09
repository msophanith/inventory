import { Outlet } from 'react-router-dom';
import MobileBottomNav from '../components/layout/mobile-bottom-nav';
import Navbar from '../components/layout/navbar';
import Sidebar from '../components/layout/sidebar';
import { AppFooter } from '../components/layout/app-footer';
import { ShortcutsModal } from '../components/layout/shortcuts-modal';
import { PwaInstallBanner } from '../components/layout/pwa-install-banner';
import { useKeyboardShortcuts } from '../hooks/use-keyboard-shortcuts';
import { usePwaAutoUpdate } from '../hooks/use-pwa-auto-update';

export default function AppLayout() {
  usePwaAutoUpdate();
  const { isHelpOpen, setIsHelpOpen } = useKeyboardShortcuts();

  return (
    <div className='flex min-h-screen bg-slate-100'>
      <Sidebar />

      <div className='flex flex-1 flex-col min-w-0 overflow-x-hidden'>
        <Navbar />

        <main className='flex-1 flex flex-col min-w-0 pb-20 lg:pb-0'>
          <div className='flex-1 min-w-0'>
            <Outlet />
          </div>
          <AppFooter />
        </main>

        <MobileBottomNav />
      </div>

      <PwaInstallBanner />
      <ShortcutsModal open={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
