import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import type { ReceiptData } from '../types/sell.types';
import { formatDateTime } from '../../../utils/date';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';

export const PAYMENT_QR_CODE_VALUE =
  '00020101021129450016abaakhppxxx@abaa01090177373060208ABA Bank40600006abaP2P0112083EB929820E020901773730603090176336980404Dual5204000053031165802KH5908SILA SAO6010Phnom Penh630410DF';

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
  doc.text('Auto Spare Parts Store', margin, y);

  doc.setFontSize(24);
  doc.setTextColor(79, 70, 229);
  doc.text('TAX INVOICE', pageWidth - margin, y, { align: 'right' });
  y += 7;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Sales Receipt & Official Tax Document', margin, y);
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
  doc.text('Invoice No:', margin, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(`#${receipt.orderId}`, margin + 22, y);

  doc.setFont('Helvetica', 'bold');
  doc.text('Date:', 90, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(formatDateTime(receipt.createdAt), 102, y);

  doc.setFont('Helvetica', 'bold');
  doc.text('Payment:', 150, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(receipt.paymentMethod.toUpperCase(), 168, y);
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
  doc.text('#', margin + 3, y + 6);
  doc.text('Item Description', margin + 12, y + 6);
  doc.text('Qty', 125, y + 6, { align: 'right' });
  doc.text('Unit Price', 158, y + 6, { align: 'right' });
  doc.text('Total Amount', pageWidth - margin - 3, y + 6, { align: 'right' });
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
    doc.text(`${idx + 1}`, margin + 3, y + 5.5);
    // Fixed max width 85mm ensures item description never overlaps Qty column
    doc.text(item.product.name, margin + 12, y + 5.5, { maxWidth: 85 });
    doc.text(`${item.quantity} ${item.product.unit || ''}`, 125, y + 5.5, {
      align: 'right',
    });
    doc.text(formatCurrencyUsd(item.unitPrice), 158, y + 5.5, {
      align: 'right',
    });
    doc.text(formatCurrencyUsd(total), pageWidth - margin - 3, y + 5.5, {
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
    doc.text('Scan to Pay (KHQR)', margin + qrSize / 2, y + qrSize + 4, {
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
    doc.text(
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
  doc.text(
    `Grand Total: ${formatCurrencyUsd(receipt.total)}`,
    summaryX,
    y + 7,
    { align: 'right' },
  );
  y += 7;

  doc.setFontSize(10);
  doc.setTextColor(37, 99, 235);
  doc.text(`( ${formatCurrencyKhr(receipt.total)} )`, summaryX, y + 6, {
    align: 'right',
  });
  y += 8;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Amount Paid (${receipt.paymentMethod}): ${formatCurrencyUsd(receipt.amountPaid)}`,
    summaryX,
    y + 5,
    { align: 'right' },
  );
  y += 5;

  if (receipt.change > 0) {
    doc.text(
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
  doc.text(
    'Thank you for your purchase! Please keep this receipt for your records.',
    pageWidth / 2,
    y,
    { align: 'center' },
  );

  return doc.output('blob');
}
