import type { jsPDF } from 'jspdf';
import type { ReceiptData } from '../types/sell.types';
import { formatDate } from '../../../utils/date';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';
import { drawText } from './pdf-canvas-utils';

export function renderInvoiceHeader(doc: jsPDF, receipt: ReceiptData, fontName: string): number {
  let y = 10;
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
  drawText(doc, `Date: ${formatDate(receipt.createdAt)}`, 5, y);
  y += 4;
  drawText(doc, `Payment: ${receipt.paymentMethod.toUpperCase()}`, 5, y);
  y += 4;
  drawText(doc, `Cashier: ${receipt.soldBy || 'Admin'}`, 5, y);
  y += 6;

  return y;
}

export function renderInvoiceTotals(doc: jsPDF, receipt: ReceiptData, startY: number, fontName: string): number {
  let y = startY;
  doc.line(5, y, 75, y);
  y += 5;

  doc.setFont(fontName, 'normal');
  if (receipt.subtotal !== receipt.total) {
    drawText(doc, 'Subtotal:', 45, y, { align: 'right' });
    drawText(doc, formatCurrencyUsd(receipt.subtotal), 75, y, { align: 'right' });
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
  drawText(doc, formatCurrencyUsd(receipt.amountPaid), 75, y, { align: 'right' });
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

  return y;
}
