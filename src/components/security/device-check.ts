/**
 * Device detection utility for DevTools Guard.
 * Identifies mobile phones, iPads, and tablets so security restrictions
 * and false-positive viewport metrics can be safely bypassed.
 */

export const isMobileOrTablet = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  const ua = navigator.userAgent || navigator.vendor || '';

  // 1. Check common mobile and tablet user-agents
  const mobileRegex =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|silk|kindle|tablet|mobile/i;
  if (mobileRegex.test(ua)) {
    return true;
  }

  // 2. iPadOS detection: iPadOS 13+ identifies as Macintosh in userAgent
  // but has multi-touch support (> 1 touch points). Real Macs have 0 touch points.
  const isIPadOS =
    (/macintosh/i.test(ua) || navigator.platform === 'MacIntel') &&
    typeof navigator.maxTouchPoints === 'number' &&
    navigator.maxTouchPoints > 1;

  if (isIPadOS) {
    return true;
  }

  // 3. Touch devices with coarse pointer (phones/tablets without hover)
  const isCoarseTouch =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse) and (hover: none)').matches;

  if (isCoarseTouch) {
    return true;
  }

  return false;
};
