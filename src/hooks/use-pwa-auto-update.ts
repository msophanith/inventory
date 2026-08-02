import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Custom hook to ensure standalone Home Screen PWAs automatically check for,
 * download, and apply the latest deployment updates when opened or focused.
 */
export function usePwaAutoUpdate() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(_swScriptUrl, registration) {
      if (!registration) return;

      const checkForUpdate = () => {
        if (navigator.onLine) {
          registration.update().catch(() => {
            // Silently ignore update check errors (e.g. offline)
          });
        }
      };

      // Check for deployment updates whenever user re-opens or switches to app (crucial for PWA Home Screen standalone mode)
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          checkForUpdate();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', checkForUpdate);

      // Check periodically every 30 minutes
      const intervalId = setInterval(checkForUpdate, 30 * 60 * 1000);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', checkForUpdate);
        clearInterval(intervalId);
      };
    },
    onRegisterError(error) {
      console.error('Service worker registration failed:', error);
    },
  });

  useEffect(() => {
    let refreshing = false;

    // Reload page when new service worker activates and claims control
    const handleControllerChange = () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    }

    if (needRefresh) {
      updateServiceWorker(true);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      }
    };
  }, [needRefresh, updateServiceWorker]);
}
