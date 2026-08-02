import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/use-auth';

export interface ShortcutItem {
  readonly key: string;
  readonly label: string;
  readonly path: string;
  readonly description: string;
  readonly adminOnly?: boolean;
}

export const SHORTCUT_LIST: ShortcutItem[] = [
  { key: 's', label: 'S', path: '/sell', description: 'Go to POS / Sell', adminOnly: false },
  { key: 'm', label: 'M', path: '/movement', description: 'Go to Stock Movement', adminOnly: true },
  { key: 'd', label: 'D', path: '/', description: 'Go to Dashboard', adminOnly: true },
  { key: 'p', label: 'P', path: '/products', description: 'Go to Products', adminOnly: true },
  { key: 'r', label: 'R', path: '/report', description: 'Go to Sales Report', adminOnly: true },
  { key: 'n', label: 'N', path: '/products/new', description: 'Create New Product', adminOnly: true },
  { key: 'c', label: 'C', path: '/scan', description: 'Go to Scan Product', adminOnly: true },
];

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      const isInputFocused =
        activeEl &&
        (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName) || activeEl.isContentEditable);

      if (e.key === 'Escape') {
        setIsHelpOpen(false);
        return;
      }

      if ((e.key === '?' && !isInputFocused) || (e.altKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setIsHelpOpen((prev) => !prev);
        return;
      }

      if (isInputFocused && !e.altKey) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toLowerCase();
      const match = SHORTCUT_LIST.find((item) => item.key === key && (isAdmin || !item.adminOnly));

      if (match) {
        e.preventDefault();
        navigate(match.path);
        setIsHelpOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, isAdmin]);

  const activeShortcuts = SHORTCUT_LIST.filter((s) => isAdmin || !s.adminOnly);

  return {
    isHelpOpen,
    setIsHelpOpen,
    shortcuts: activeShortcuts,
  };
}
