import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

import type { ReceiptData } from '../types/sell.types';
import {
  KHMER_FONT_REGULAR_BASE64,
  KHMER_FONT_BOLD_BASE64,
} from './khmer-fonts';
import { drawText, hasKhmerText } from './pdf-canvas-utils';
import { renderInvoiceHeader, renderInvoiceTotals } from './pdf-invoice-formatter';

export { hasKhmerText };

export const PAYMENT_QR_CODE_VALUE =
  '00020101021129450016abaakhppxxx@abaa01090177373060208ABA Bank40600006abaP2P0112083EB929820E020901773730603090176336980404Dual5204000053031165802KH5908SILA SAO6010Phnom Penh630410DF';

export async function generatePdfInvoiceBlob(
  receipt: ReceiptData,
): Promise<Blob> {
  const pageHeight = Math.max(175, 120 + receipt.items.length * 5);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, pageHeight],
  });

  doc.addFileToVFS('Suwannaphum-Regular.ttf', KHMER_FONT_REGULAR_BASE64);
  doc.addFont('Suwannaphum-Regular.ttf', 'Suwannaphum', 'normal');

  doc.addFileToVFS('Suwannaphum-Bold.ttf', KHMER_FONT_BOLD_BASE64);
  doc.addFont('Suwannaphum-Bold.ttf', 'Suwannaphum', 'bold');

  const fontName = 'Suwannaphum';

  let y = renderInvoiceHeader(doc, receipt, fontName);

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
    drawText(doc, `${item.quantity} ${item.unit || item.product.unit || ''}`, 45, y, { align: 'right' });
    drawText(doc, `$${item.unitPrice.toFixed(2)}`, 58, y, { align: 'right' });
    drawText(doc, `$${itemTotal.toFixed(2)}`, 75, y, { align: 'right' });
    y += 4.5;
  });

  y = renderInvoiceTotals(doc, receipt, y, fontName);

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
