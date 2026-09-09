import { useEffect, useState } from 'react';
import { setNetworkBlocked } from './network-guard';

const WIDTH_THRESHOLD = 160;
const HEIGHT_THRESHOLD = 220;

export const isDevBypassed = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    !import.meta.env.PROD && localStorage.getItem('allow_dev_mode') === 'true'
  );
};

export const checkDevToolsInitial = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (isDevBypassed()) return false;
  const widthDiff = window.outerWidth - window.innerWidth > WIDTH_THRESHOLD;
  const heightDiff = window.outerHeight - window.innerHeight > HEIGHT_THRESHOLD;
  return widthDiff || heightDiff;
};

// If DevTools is already open on page load, block network immediately
if (checkDevToolsInitial()) {
  setNetworkBlocked(true);
}

export function useDevToolsDetector() {
  const [isOpen, setIsOpen] = useState(checkDevToolsInitial);

  useEffect(() => {
    // In production, protection is always strictly enforced.
    // In dev, bypass is allowed if 'allow_dev_mode' is set to 'true'.
    if (isDevBypassed()) {
      setNetworkBlocked(false);
      return;
    }

    const checkDevTools = () => {
      if (isDevBypassed()) return false;

      // 1. Dimensions check (docked DevTools on side or bottom)
      const widthDiff = window.outerWidth - window.innerWidth > WIDTH_THRESHOLD;
      const heightDiff =
        window.outerHeight - window.innerHeight > HEIGHT_THRESHOLD;
      if (widthDiff || heightDiff) return true;

      // 2. Debugger timing probe (detects undocked DevTools and macOS fullscreen)
      const start = performance.now();
      const fn = new Function('debugger');
      fn();
      if (performance.now() - start > 100) return true;

      return false;
    };

    const runProbe = () => {
      const active = checkDevTools();
      setIsOpen(active);
      setNetworkBlocked(active);
    };

    // Keyboard shortcut interception
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDevBypassed()) return;

      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (
        e.key === 'F12' ||
        (isCmdOrCtrl && (e.key === 'u' || e.key === 'U')) ||
        (isCmdOrCtrl &&
          e.shiftKey &&
          ['i', 'I', 'j', 'J', 'c', 'C'].includes(e.key)) ||
        (isMac &&
          e.metaKey &&
          e.altKey &&
          ['i', 'I', 'j', 'J', 'c', 'C'].includes(e.key))
      ) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
        setNetworkBlocked(true);
      }
    };

    // Right-click context menu prevention
    const handleContextMenu = (e: MouseEvent) => {
      if (isDevBypassed()) return;
      e.preventDefault();
    };

    const interval = setInterval(runProbe, 600);
    window.addEventListener('resize', runProbe);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('contextmenu', handleContextMenu, true);

    runProbe();

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', runProbe);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('contextmenu', handleContextMenu, true);
    };
  }, []);

  return { isOpen, setIsOpen };
}

export default useDevToolsDetector;
