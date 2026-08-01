import { useEffect, useRef, useState } from 'react';

interface Options {
  readonly active: boolean;
  readonly onDetected: (code: string) => void;
}

export function useCameraScanner({ active, onDetected }: Options) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!active) return;
    let stream: MediaStream | null = null;
    let animationFrameId: number;

    const startCamera = async () => {
      try {
        setError(null);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsScanning(true);
        }

        // Check if native BarcodeDetector API is supported
        if ('BarcodeDetector' in window) {
          const detector = new (window as any).BarcodeDetector({
            formats: ['qr_code', 'ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a'],
          });

          const detectFrame = async () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
              try {
                const barcodes = await detector.detect(videoRef.current);
                if (barcodes.length > 0) {
                  onDetected(barcodes[0].rawValue);
                }
              } catch {
                // Ignore frame detection errors
              }
            }
            if (stream && stream.active) {
              animationFrameId = requestAnimationFrame(detectFrame);
            }
          };

          detectFrame();
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Camera access denied';
        setError(message);
      }
    };

    startCamera();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setIsScanning(false);
    };
  }, [active, onDetected]);

  return { videoRef, error, isScanning };
}
