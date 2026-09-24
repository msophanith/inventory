export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  const isSmallScreen = window.innerWidth < 1024;
  const isMobileUserAgent =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  return isSmallScreen || isMobileUserAgent;
};
