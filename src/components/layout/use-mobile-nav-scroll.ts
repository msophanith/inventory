import { useEffect, useRef, useState } from 'react';

export function useMobileNavScroll(isDrawerOpen: boolean) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        // handled in parent if needed
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  useEffect(() => {
    const handleScroll = (currentScrollY: number) => {
      if (isDrawerOpen) return;
      if (currentScrollY > lastScrollY.current && currentScrollY > 30) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    const mainEl = document.querySelector('main');
    const onMainScroll = () => mainEl && handleScroll(mainEl.scrollTop);
    const onWinScroll = () => handleScroll(window.scrollY);

    mainEl?.addEventListener('scroll', onMainScroll, { passive: true });
    window.addEventListener('scroll', onWinScroll, { passive: true });

    return () => {
      mainEl?.removeEventListener('scroll', onMainScroll);
      window.removeEventListener('scroll', onWinScroll);
    };
  }, [isDrawerOpen]);

  return isVisible;
}
