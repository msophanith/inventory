import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

import type { ReceiptData } from '../types/sell.types';
// import { formatDateTime } from '../../../utils/date';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';
import {
  KHMER_FONT_REGULAR_BASE64,
  KHMER_FONT_BOLD_BASE64,
} from './khmer-fonts';
import { formatDate } from '../../../utils/date';

export const PAYMENT_QR_CODE_VALUE =
  '00020101021129450016abaakhppxxx@abaa01090177373060208ABA Bank40600006abaP2P0112083EB929820E020901773730603090176336980404Dual5204000053031165802KH5908SILA SAO6010Phnom Penh630410DF';

const KHMER_REGEX = /[\u1780-\u17FF\u19E0-\u19FF]/;

export function hasKhmerText(text: string): boolean {
  return KHMER_REGEX.test(text);
}

let fontFaceInjected = false;

function ensureFontFaceInjected() {
  if (fontFaceInjected || typeof document === 'undefined') return;
  try {
    const styleId = 'khmer-suwannaphum-font';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @font-face {
          font-family: 'Suwannaphum';
          src: url(data:font/ttf;charset=utf-8;base64,${KHMER_FONT_REGULAR_BASE64}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'Suwannaphum';
          src: url(data:font/ttf;charset=utf-8;base64,${KHMER_FONT_BOLD_BASE64}) format('truetype');
          font-weight: bold;
          font-style: normal;
        }
      `;
      document.head.appendChild(style);
    }

    if ('FontFace' in window && 'fonts' in document) {
      const reg = new FontFace(
        'Suwannaphum',
        `url(data:font/ttf;charset=utf-8;base64,${KHMER_FONT_REGULAR_BASE64})`,
      );
      const bold = new FontFace(
        'Suwannaphum',
        `url(data:font/ttf;charset=utf-8;base64,${KHMER_FONT_BOLD_BASE64})`,
        { weight: 'bold' },
      );
      const fontsSet = document.fonts as unknown as Set<FontFace>;
      reg
        .load()
        .then((f) => fontsSet.add(f))
        .catch(() => {});
      bold
        .load()
        .then((f) => fontsSet.add(f))
        .catch(() => {});
    }
    fontFaceInjected = true;
  } catch (e) {
    console.warn('Could not inject FontFace:', e);
  }
}

interface DrawTextOptions {
  align?: 'left' | 'right' | 'center';
  maxWidth?: number;
  color?: string;
}

function drawText(
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

  const drawX =
    options?.align === 'right'
      ? x - textWidthPx / pxPerMm - paddingX / pxPerMm
      : options?.align === 'center'
        ? x - canvasWidthMm / 2
        : x - paddingX / pxPerMm;

  const drawY = y - baselineOffsetMm;

  const dataUrl = canvas.toDataURL('image/png');
  doc.addImage(dataUrl, 'PNG', drawX, drawY, canvasWidthMm, canvasHeightMm);
}

export async function generatePdfInvoiceBlob(
  receipt: ReceiptData,
): Promise<Blob> {
  const pageHeight = Math.max(175, 120 + receipt.items.length * 5);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, pageHeight],
  });

  // Always register Suwannaphum fonts directly into jsPDF VFS synchronously
  doc.addFileToVFS('Suwannaphum-Regular.ttf', KHMER_FONT_REGULAR_BASE64);
  doc.addFont('Suwannaphum-Regular.ttf', 'Suwannaphum', 'normal');

  doc.addFileToVFS('Suwannaphum-Bold.ttf', KHMER_FONT_BOLD_BASE64);
  doc.addFont('Suwannaphum-Bold.ttf', 'Suwannaphum', 'bold');

  const fontName = 'Suwannaphum';

  const dateFormatted = formatDate(receipt.createdAt);
  let y = 10;

  // Header
  doc.setFont(fontName, 'bold');
  doc.setFontSize(13);
  drawText(doc, 'វិក្កយបត្រ', 40, y, { align: 'center' });
  y += 5;

  doc.setFont(fontName, 'normal');
  doc.setFontSize(8);
  drawText(doc, 'Invoice', 40, y, { align: 'center' });
  y += 6;

  doc.setLineWidth(0.3);
  doc.setDrawColor(200, 200, 200);
  doc.line(5, y, 75, y);
  y += 5;

  doc.setFontSize(7.5);
  drawText(doc, `Order ID: #${receipt.orderId}`, 5, y);
  y += 4;
  drawText(doc, `Date: ${dateFormatted}`, 5, y);
  y += 4;
  drawText(doc, `Payment: ${receipt.paymentMethod.toUpperCase()}`, 5, y);
  y += 4;
  drawText(doc, `Cashier: ${receipt.soldBy || 'Admin'}`, 5, y);
  y += 6;

  // Table Header
  doc.line(5, y, 75, y);
  y += 4;
  doc.setFont(fontName, 'bold');
  drawText(doc, 'Item Description', 5, y);
  drawText(doc, 'Qty', 45, y, { align: 'right' });
  drawText(doc, 'Price', 58, y, { align: 'right' });
  drawText(doc, 'Total', 75, y, { align: 'right' });
  y += 3;
  doc.line(5, y, 75, y);
  y += 4;

  // Items List
  doc.setFont(fontName, 'normal');
  receipt.items.forEach((item) => {
    const itemTotal = item.quantity * item.unitPrice;
    drawText(doc, item.product.name, 5, y, { maxWidth: 37 });
    drawText(doc, `${item.quantity}`, 45, y, { align: 'right' });
    drawText(doc, `$${item.unitPrice.toFixed(2)}`, 58, y, { align: 'right' });
    drawText(doc, `$${itemTotal.toFixed(2)}`, 75, y, { align: 'right' });
    y += 4.5;
  });

  // Totals with Dual Currency ($ USD / ៛ KHR)
  doc.line(5, y, 75, y);
  y += 5;

  doc.setFont(fontName, 'normal');
  if (receipt.subtotal !== receipt.total) {
    drawText(doc, 'Subtotal:', 45, y, { align: 'right' });
    drawText(doc, formatCurrencyUsd(receipt.subtotal), 75, y, {
      align: 'right',
    });
    y += 4;
  }

  doc.setFont(fontName, 'bold');
  doc.setFontSize(9);
  drawText(doc, 'Grand Total ($):', 45, y, { align: 'right' });
  drawText(doc, formatCurrencyUsd(receipt.total), 75, y, { align: 'right' });
  y += 4.5;

  doc.setFont(fontName, 'bold');
  drawText(doc, 'Grand Total (KHR):', 45, y, { align: 'right' });
  drawText(doc, formatCurrencyKhr(receipt.total), 75, y, { align: 'right' });
  y += 5;

  doc.setFontSize(7.5);
  doc.setFont(fontName, 'normal');
  drawText(doc, 'Amount Paid:', 45, y, { align: 'right' });
  drawText(doc, formatCurrencyUsd(receipt.amountPaid), 75, y, {
    align: 'right',
  });
  y += 4;

  drawText(doc, 'Change:', 45, y, { align: 'right' });
  drawText(
    doc,
    `${formatCurrencyUsd(receipt.change)} (${formatCurrencyKhr(receipt.change)})`,
    75,
    y,
    { align: 'right' },
  );
  y += 6;

  // KHQR Code Section
  doc.line(5, y, 75, y);
  y += 5;

  try {
    const qrDataUrl = await QRCode.toDataURL(PAYMENT_QR_CODE_VALUE, {
      margin: 1,
      width: 250,
      errorCorrectionLevel: 'M',
    });

    const qrSize = 32;
    const qrX = (80 - qrSize) / 2;

    doc.setFont(fontName, 'bold');
    doc.setFontSize(8);
    drawText(doc, 'Scan to Pay (KHQR)', 40, y, { align: 'center' });
    y += 3;

    doc.addImage(qrDataUrl, 'PNG', qrX, y, qrSize, qrSize);
    y += qrSize + 5;
  } catch (err) {
    console.error('Error generating KHQR code for PDF invoice:', err);
  }

  doc.line(5, y, 75, y);
  y += 4;
  doc.setFont(fontName, 'normal');
  doc.setFontSize(7);
  drawText(doc, 'Thank you for your purchase!', 40, y, { align: 'center' });

  return doc.output('blob');
}
