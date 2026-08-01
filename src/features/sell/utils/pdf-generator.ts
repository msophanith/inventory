import { jsPDF } from 'jspdf';
import type { ReceiptData } from '../types/sell.types';
import { formatDateTime } from '../../../utils/date';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';

export function generatePdfInvoiceBlob(receipt: ReceiptData): Blob {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 165],
  });

  const dateFormatted = formatDateTime(receipt.createdAt);
  let y = 10;

  // Header
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('INVENTORY POS STORE', 40, y, { align: 'center' });
  y += 5;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Sales Receipt & Tax Invoice', 40, y, { align: 'center' });
  y += 6;

  doc.setLineWidth(0.3);
  doc.setDrawColor(200, 200, 200);
  doc.line(5, y, 75, y);
  y += 5;

  doc.setFontSize(7.5);
  doc.text(`Order ID: #${receipt.orderId}`, 5, y);
  y += 4;
  doc.text(`Date: ${dateFormatted}`, 5, y);
  y += 4;
  doc.text(`Payment: ${receipt.paymentMethod.toUpperCase()}`, 5, y);
  y += 6;

  // Table Header
  doc.line(5, y, 75, y);
  y += 4;
  doc.setFont('Helvetica', 'bold');
  doc.text('Item Description', 5, y);
  doc.text('Qty', 45, y, { align: 'right' });
  doc.text('Price', 58, y, { align: 'right' });
  doc.text('Total', 75, y, { align: 'right' });
  y += 3;
  doc.line(5, y, 75, y);
  y += 4;

  // Items List
  doc.setFont('Helvetica', 'normal');
  receipt.items.forEach((item) => {
    const itemTotal = item.quantity * item.unitPrice;
    const name = item.product.name.length > 20 ? `${item.product.name.slice(0, 18)}..` : item.product.name;
    doc.text(name, 5, y);
    doc.text(`${item.quantity}`, 45, y, { align: 'right' });
    doc.text(`$${item.unitPrice.toFixed(2)}`, 58, y, { align: 'right' });
    doc.text(`$${itemTotal.toFixed(2)}`, 75, y, { align: 'right' });
    y += 4.5;
  });

  // Totals with Dual Currency ($ USD / ៛ KHR)
  doc.line(5, y, 75, y);
  y += 5;

  doc.setFont('Helvetica', 'normal');
  if (receipt.subtotal !== receipt.total) {
    doc.text('Subtotal:', 45, y, { align: 'right' });
    doc.text(formatCurrencyUsd(receipt.subtotal), 75, y, { align: 'right' });
    y += 4;
  }

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Grand Total ($):', 45, y, { align: 'right' });
  doc.text(formatCurrencyUsd(receipt.total), 75, y, { align: 'right' });
  y += 4.5;

  doc.setFont('Helvetica', 'bold');
  doc.text('Grand Total (KHR):', 45, y, { align: 'right' });
  doc.text(formatCurrencyKhr(receipt.total), 75, y, { align: 'right' });
  y += 5;

  doc.setFontSize(7.5);
  doc.setFont('Helvetica', 'normal');
  doc.text('Amount Paid:', 45, y, { align: 'right' });
  doc.text(formatCurrencyUsd(receipt.amountPaid), 75, y, { align: 'right' });
  y += 4;

  doc.text('Change:', 45, y, { align: 'right' });
  doc.text(`${formatCurrencyUsd(receipt.change)} (${formatCurrencyKhr(receipt.change)})`, 75, y, { align: 'right' });
  y += 8;

  doc.line(5, y, 75, y);
  y += 4;
  doc.setFont('Helvetica', 'italic');
  doc.setFontSize(7);
  doc.text('Thank you for your purchase!', 40, y, { align: 'center' });

  return doc.output('blob');
}
