import { Outlet } from 'react-router-dom';
import MobileBottomNav from '../components/layout/mobile-bottom-nav';
import Navbar from '../components/layout/navbar';
import Sidebar from '../components/layout/sidebar';
import { ShortcutsModal } from '../components/layout/shortcuts-modal';
import { useKeyboardShortcuts } from '../hooks/use-keyboard-shortcuts';

export default function AppLayout() {
  const { isHelpOpen, setIsHelpOpen } = useKeyboardShortcuts();

  return (
    <div className='flex min-h-screen bg-slate-100'>
      <Sidebar />

      <div className='flex flex-1 flex-col min-w-0 overflow-x-hidden'>
        <Navbar />

        <main className='flex-1 overflow-y-auto min-w-0 pb-24 lg:pb-12'>
          <Outlet />
        </main>

        <MobileBottomNav />
      </div>

      <ShortcutsModal open={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
