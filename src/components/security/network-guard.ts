/**
 * Network Guard for DevTools Security Shield
 * Suppresses all outgoing network activity (fetch & XMLHttpRequest)
 * when DevTools inspection is detected.
 */

let originalFetch: typeof window.fetch | null = null;
let originalXHROpen: typeof XMLHttpRequest.prototype.open | null = null;
let originalXHRSend: typeof XMLHttpRequest.prototype.send | null = null;
let isBlocked = false;

export function setNetworkBlocked(blocked: boolean): void {
  if (typeof window === 'undefined') return;
  if (isBlocked === blocked) return;
  isBlocked = blocked;

  if (blocked) {
    // 1. Intercept and silence window.fetch
    if (!originalFetch && window.fetch) {
      originalFetch = window.fetch.bind(window);
      window.fetch = function () {
        return Promise.reject(
          new DOMException('Blocked by security policy', 'AbortError'),
        );
      };
    }

    // 2. Intercept and silence XMLHttpRequest
    if (!originalXHRSend && window.XMLHttpRequest) {
      originalXHROpen = XMLHttpRequest.prototype.open;
      originalXHRSend = XMLHttpRequest.prototype.send;

      XMLHttpRequest.prototype.open = function () {
        return;
      };

      XMLHttpRequest.prototype.send = function () {
        throw new DOMException('Blocked by security policy', 'AbortError');
      };
    }
  } else {
    // Restore native window.fetch
    if (originalFetch) {
      window.fetch = originalFetch;
      originalFetch = null;
    }

    // Restore native XMLHttpRequest
    if (originalXHRSend && originalXHROpen) {
      XMLHttpRequest.prototype.open = originalXHROpen;
      XMLHttpRequest.prototype.send = originalXHRSend;
      originalXHROpen = null;
      originalXHRSend = null;
    }
  }
}

export function isNetworkBlocked(): boolean {
  return isBlocked;
}
