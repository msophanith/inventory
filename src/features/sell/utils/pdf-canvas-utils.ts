import type { jsPDF } from 'jspdf';
import { ensureFontFaceInjected } from './khmer-font-injector';

const KHMER_REGEX = /[\u1780-\u17FF\u19E0-\u19FF]/;

export function hasKhmerText(text: string): boolean {
  return KHMER_REGEX.test(text);
}

export interface DrawTextOptions {
  align?: 'left' | 'right' | 'center';
  maxWidth?: number;
  color?: string;
}

export function calculateDrawX(
  align: 'left' | 'right' | 'center' | undefined,
  x: number,
  textWidthPx: number,
  paddingX: number,
  pxPerMm: number,
  canvasWidthMm: number,
): number {
  if (align === 'right') {
    return x - textWidthPx / pxPerMm - paddingX / pxPerMm;
  }
  if (align === 'center') {
    return x - canvasWidthMm / 2;
  }
  return x - paddingX / pxPerMm;
}

export function drawText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  options?: DrawTextOptions,
) {
  if (!text) return;

  ensureFontFaceInjected();

  if (!hasKhmerText(text)) {
    doc.text(text, x, y, {
      align: options?.align,
      maxWidth: options?.maxWidth,
    });
    return;
  }

  const fontSizePt = doc.getFontSize() || 8;
  const fontStyle = doc.getFont()?.fontStyle || 'normal';
  const fontWeight = fontStyle.includes('bold') ? 'bold' : 'normal';

  const scale = 4;
  const pxPerMm = (96 / 25.4) * scale;
  const fontSizePx = fontSizePt * 1.3333 * scale;

  if (typeof document === 'undefined') {
    doc.text(text, x, y, {
      align: options?.align,
      maxWidth: options?.maxWidth,
    });
    return;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    doc.text(text, x, y, {
      align: options?.align,
      maxWidth: options?.maxWidth,
    });
    return;
  }

  const fontFamily =
    '"Suwannaphum", "Noto Sans Khmer", "Kantumruy Pro", "Khmer OS Siemreap", sans-serif';
  ctx.font = `${fontWeight} ${fontSizePx}px ${fontFamily}`;

  let textToRender = text;
  if (options?.maxWidth) {
    const maxPx = options.maxWidth * pxPerMm;
    if (ctx.measureText(textToRender).width > maxPx) {
      while (
        textToRender.length > 0 &&
        ctx.measureText(textToRender + '…').width > maxPx
      ) {
        textToRender = textToRender.slice(0, -1);
      }
      textToRender += '…';
    }
  }

  const metrics = ctx.measureText(textToRender);
  const textWidthPx = metrics.width;

  const paddingX = 10 * scale;
  const canvasWidthPx = Math.ceil(textWidthPx + paddingX * 2);
  const canvasHeightPx = Math.ceil(fontSizePx * 2.0);
  const baselineYPx = Math.ceil(fontSizePx * 1.3);

  canvas.width = canvasWidthPx;
  canvas.height = canvasHeightPx;

  ctx.font = `${fontWeight} ${fontSizePx}px ${fontFamily}`;
  ctx.textBaseline = 'alphabetic';

  let textColor = options?.color;
  if (!textColor) {
    const rawColor = doc.getTextColor();
    textColor = typeof rawColor === 'string' ? rawColor : '#000000';
  }
  ctx.fillStyle = textColor;

  ctx.fillText(textToRender, paddingX, baselineYPx);

  const canvasWidthMm = canvasWidthPx / pxPerMm;
  const canvasHeightMm = canvasHeightPx / pxPerMm;
  const baselineOffsetMm = baselineYPx / pxPerMm;

  const drawX = calculateDrawX(
    options?.align,
    x,
    textWidthPx,
    paddingX,
    pxPerMm,
    canvasWidthMm,
  );

  const drawY = y - baselineOffsetMm;

  const dataUrl = canvas.toDataURL('image/png');
  doc.addImage(dataUrl, 'PNG', drawX, drawY, canvasWidthMm, canvasHeightMm);
}
