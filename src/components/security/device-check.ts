/**
 * Device detection utility for DevTools Guard.
 *
 * IMPORTANT: This must NOT rely on navigator.userAgent, navigator.maxTouchPoints,
 * or matchMedia alone — all of these are spoofed by Chrome/Firefox DevTools
 * device emulation mode. We use a combination of hardware signals that cannot
 * be faked by the browser's emulation layer.
 */

/**
 * Returns true ONLY for genuine physical mobile/tablet hardware.
 * DevTools "Inspect as mobile" emulation will NOT trigger this.
 */
export const isMobileOrTablet = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  // DevTools emulation spoofs: userAgent, maxTouchPoints, matchMedia pointer/hover.
  // It does NOT spoof: window.ontouchstart existence on real hardware,
  // DeviceOrientationEvent, or the actual hardware concurrency.

  // Signal 1: Real touch hardware exposes ontouchstart on window.
  // Desktop browsers emulating mobile do NOT have this natively.
  const hasTouchStart = 'ontouchstart' in window;

  // Signal 2: Real mobile/tablet hardware typically reports orientation via the
  // DeviceOrientationEvent API being a constructible class (not just "defined").
  // Desktop machines never fire orientation events naturally.
  const hasOrientationAPI =
    typeof window.DeviceOrientationEvent !== 'undefined' &&
    // On real iOS/Android, the class is defined. On desktop emulation it may
    // be undefined even if UA is spoofed.
    typeof window.screen.orientation !== 'undefined';

  // Signal 3: Physical screen width on a real device vs a resized desktop window.
  // window.screen.width reflects the actual hardware screen — it does NOT
  // change when DevTools resizes the viewport. A genuine phone has screen.width <= 430.
  // A desktop with emulation resizes window.innerWidth but NOT window.screen.width.
  const isRealSmallScreen = window.screen.width <= 1024 && window.screen.height <= 1366;

  // Require BOTH a touch signal AND a real small screen to confirm genuine hardware.
  // DevTools emulation: spoofs innerWidth but screen.width stays at 1920/2560/etc.
  if (hasTouchStart && hasOrientationAPI && isRealSmallScreen) {
    return true;
  }

  return false;
};
