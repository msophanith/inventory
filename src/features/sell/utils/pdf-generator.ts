import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { format } from 'date-fns';

import type { ReceiptData } from '../types/sell.types';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';

export const PAYMENT_QR_CODE_VALUE =
  '00020101021129450016abaakhppxxx@abaa01090177373060208ABA Bank40600006abaP2P0112083EB929820E020901773730603090176336980404Dual5204000053031165802KH5908SILA SAO6010Phnom Penh630410DF';

const KHMER_REGEX = /[\u1780-\u17FF\u19E0-\u19FF]/;

export function hasKhmerText(text: string): boolean {
  return KHMER_REGEX.test(text);
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

  if (!hasKhmerText(text)) {
    doc.text(text, x, y, {
      align: options?.align,
      maxWidth: options?.maxWidth,
    });
    return;
  }

  const fontSizePt = doc.getFontSize() || 10;
  const fontStyle = doc.getFont()?.fontStyle || 'normal';
  const fontWeight = fontStyle.includes('bold') ? 'bold' : 'normal';

  const scale = 4;
  const pxPerMm = (96 / 25.4) * scale;
  const fontSizePx = fontSizePt * 1.3333 * scale;

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
    '"Kantumruy Pro", "Noto Sans Khmer", "Khmer OS Siemreap", "Khmer OS Battambang", "Khmer MN", "Leelawadee UI", sans-serif';
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
    textColor = typeof rawColor === 'string' ? rawColor : '#334155';
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
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  let y = 20;

  // Header Banner
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42);
  drawText(doc, 'Chomkar Doung - Auto Spare Parts', margin, y);

  doc.setFontSize(24);
  doc.setTextColor(79, 70, 229);
  drawText(doc, 'INVOICE', pageWidth - margin, y, { align: 'right' });
  y += 7;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  drawText(doc, 'Sales Receipt & Official Tax Document', margin, y);
  y += 8;

  // Divider Line
  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Metadata Grid
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.setFont('Helvetica', 'bold');
  drawText(doc, 'Invoice No:', margin, y);
  doc.setFont('Helvetica', 'normal');
  drawText(doc, `#${receipt.orderId}`, margin + 22, y);

  doc.setFont('Helvetica', 'bold');
  drawText(doc, 'Date:', 90, y);
  doc.setFont('Helvetica', 'normal');
  drawText(doc, format(new Date(receipt.createdAt), 'dd MMM yyyy'), 102, y);

  doc.setFont('Helvetica', 'bold');
  drawText(doc, 'Payment:', 150, y);
  doc.setFont('Helvetica', 'normal');
  drawText(doc, receipt.paymentMethod.toUpperCase(), 168, y);
  y += 10;

  // Table Header Box
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, 9, 'F');
  doc.setLineWidth(0.3);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 9, 'S');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  drawText(doc, '#', margin + 3, y + 6);
  drawText(doc, 'Item Description', margin + 12, y + 6);
  drawText(doc, 'Qty', 125, y + 6, { align: 'right' });
  drawText(doc, 'Unit Price', 158, y + 6, { align: 'right' });
  drawText(doc, 'Total Amount', pageWidth - margin - 3, y + 6, {
    align: 'right',
  });
  y += 9;

  // Table Item Rows
  doc.setFont('Helvetica', 'normal');
  receipt.items.forEach((item, idx) => {
    const total = item.quantity * item.unitPrice;
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 8, 'F');
    }
    doc.setDrawColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 8, 'S');

    doc.setTextColor(51, 65, 85);
    drawText(doc, `${idx + 1}`, margin + 3, y + 5.5);
    // Fixed max width 85mm ensures item description never overlaps Qty column
    drawText(doc, item.product.name, margin + 12, y + 5.5, { maxWidth: 85 });
    drawText(doc, `${item.quantity} ${item.product.unit || ''}`, 125, y + 5.5, {
      align: 'right',
    });
    drawText(doc, formatCurrencyUsd(item.unitPrice), 158, y + 5.5, {
      align: 'right',
    });
    drawText(doc, formatCurrencyUsd(total), pageWidth - margin - 3, y + 5.5, {
      align: 'right',
    });
    y += 8;
  });

  y += 8;

  // KHQR Section (Left)
  try {
    const qrDataUrl = await QRCode.toDataURL(PAYMENT_QR_CODE_VALUE, {
      margin: 1,
      width: 200,
    });
    const qrSize = 35;
    doc.addImage(qrDataUrl, 'PNG', margin, y, qrSize, qrSize);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    drawText(doc, 'Scan to Pay (KHQR)', margin + qrSize / 2, y + qrSize + 4, {
      align: 'center',
    });
  } catch (err) {
    console.error('Error adding KHQR image to PDF:', err);
  }

  // Summary Totals (Right)
  const summaryX = pageWidth - margin;
  if (receipt.subtotal !== receipt.total) {
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    drawText(
      doc,
      `Subtotal: ${formatCurrencyUsd(receipt.subtotal)}`,
      summaryX,
      y + 5,
      { align: 'right' },
    );
    y += 6;
  }

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  drawText(
    doc,
    `Grand Total: ${formatCurrencyUsd(receipt.total)}`,
    summaryX,
    y + 7,
    { align: 'right' },
  );
  y += 7;

  // doc.setFontSize(10);
  // doc.setTextColor(37, 99, 235);
  // drawText(doc, `( ${formatCurrencyKhr(receipt.total)} )`, summaryX, y + 6, {
  //   align: 'right',
  // });
  // y += 8;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  drawText(
    doc,
    `Amount Paid (${receipt.paymentMethod}): ${formatCurrencyUsd(receipt.amountPaid)}`,
    summaryX,
    y + 5,
    { align: 'right' },
  );
  y += 5;

  if (receipt.change > 0) {
    drawText(
      doc,
      `Change: ${formatCurrencyUsd(receipt.change)} (${formatCurrencyKhr(receipt.change)})`,
      summaryX,
      y + 5,
      { align: 'right' },
    );
  }

  // Footer Message
  y = pageHeight - 20;
  doc.setLineWidth(0.4);
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFont('Helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  drawText(
    doc,
    'Thank you for your purchase! Please keep this receipt for your records.',
    pageWidth / 2,
    y,
    { align: 'center' },
  );

  return doc.output('blob');
}
