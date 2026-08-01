import { useEffect, useRef } from 'react';

interface Options {
  readonly enabled?: boolean;
  readonly onScan: (barcode: string) => void;
}

/**
 * Robust keyboard listener for hardware USB/Bluetooth barcode guns.
 * Hardware guns send keystrokes in bursts (< 50ms per key) followed by 'Enter'.
 */
export function useHardwareScanner({ enabled = true, onScan }: Options) {
  const bufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(0);
  const fastKeyCountRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore navigation keys or modifier keys
      if (['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'Escape'].includes(e.key)) {
        return;
      }

      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTimeRef.current;
      lastKeyTimeRef.current = currentTime;

      // Hardware scanners output characters rapidly (<100ms apart)
      if (timeDiff < 100) {
        fastKeyCountRef.current += 1;
      } else {
        // Slow keypress (human typing) -> reset buffer if not rapid burst
        fastKeyCountRef.current = 0;
        bufferRef.current = '';
      }

      if (e.key === 'Enter') {
        const barcode = bufferRef.current.trim();
        // Fire scan if burst detected or buffer contains valid barcode string
        if (barcode.length >= 2 && (fastKeyCountRef.current >= 1 || timeDiff < 150)) {
          onScan(barcode);
          e.preventDefault();
        }
        bufferRef.current = '';
        fastKeyCountRef.current = 0;
      } else if (e.key.length === 1) {
        bufferRef.current += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [enabled, onScan]);
}
