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
  const widthPx = 1240;
  const heightPx = 1754;

  const canvas = document.createElement('canvas');
  canvas.width = widthPx;
  canvas.height = heightPx;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context for A4 invoice');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, widthPx, heightPx);
  ctx.textBaseline = 'top';

  const font = (weight = 'normal', size = 18) =>
    `${weight} ${size}px "Kantumruy Pro", "Suwannaphum", "Battambang", "Khmer OS", "Inter", sans-serif`;

  const primaryColor = '#0f172a';
  const secondaryColor = '#334155';
  const textColor = '#0f172a';
  const borderGray = '#e2e8f0';
  const darkGray = '#64748b';

  let y = 60;

  // --- Header ---
  // Shop Name (Left)
  ctx.fillStyle = secondaryColor;
  ctx.textAlign = 'left';
  ctx.font = font('bold', 34);
  ctx.fillText('លក់គ្រឿងបន្លាស់រថយន្ត ចម្ការដូង', 60, y);

  ctx.fillStyle = darkGray;
  ctx.font = font('normal', 18);
  ctx.fillText('Tel: 086-563-535', 60, y + 45);

  // Invoice Label (Right)
  ctx.fillStyle = primaryColor;
  ctx.textAlign = 'right';
  ctx.font = font('bold', 52);
  ctx.fillText('វិក្កយបត្រ', widthPx - 60, y - 10);

  ctx.fillStyle = secondaryColor;
  ctx.font = font('normal', 22);
  ctx.fillText('INVOICE', widthPx - 60, y + 55);

  y += 110;

  // --- Transaction Info Box ---
  ctx.strokeStyle = borderGray;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(60, y);
  ctx.lineTo(widthPx - 60, y);
  ctx.stroke();

  y += 20;

  // Labels Row (Top)
  ctx.fillStyle = darkGray;
  ctx.font = font('bold', 15);
  ctx.textAlign = 'left';
  ctx.fillText('កាលបរិច្ឆេទ / DATE', 60, y);
  ctx.fillText('INVOICE ID', 480, y);
  ctx.fillText('REFERENCE', 900, y);

  y += 25;

  // Values Row
  ctx.fillStyle = secondaryColor;
  ctx.font = font('normal', 18);
  ctx.fillText(formatDateTime(receipt.createdAt), 60, y);
  ctx.fillText(`#${receipt.orderId}`, 480, y);
  ctx.fillText(receipt.paymentMethod.toUpperCase(), 900, y);

  y += 35;

  ctx.beginPath();
  ctx.moveTo(60, y);
  ctx.lineTo(widthPx - 60, y);
  ctx.stroke();

  y += 30;

  // --- Transaction Details Table ---
  // Header Row
  ctx.fillStyle = darkGray;
  ctx.font = font('bold', 16);
  ctx.textAlign = 'left';
  ctx.fillText('ITEM DESCRIPTION', 60, y);
  ctx.textAlign = 'center';
  ctx.fillText('QTY', 750, y);
  ctx.textAlign = 'right';
  ctx.fillText('PRICE', 940, y);
  ctx.fillText('AMOUNT', widthPx - 60, y);

  y += 30;
  ctx.beginPath();
  ctx.moveTo(60, y);
  ctx.lineTo(widthPx - 60, y);
  ctx.stroke();

  y += 20;

  // Table Rows
  receipt.items.forEach((item) => {
    const total = item.quantity * item.unitPrice;

    // Item Title
    ctx.fillStyle = textColor;
    ctx.textAlign = 'left';
    ctx.font = font('bold', 20);
    ctx.fillText(item.product.name, 60, y);

    // Item Subtitle
    ctx.fillStyle = darkGray;
    ctx.font = font('normal', 15);
    const itemSub = item.product.barcode || item.product.category || '';
    ctx.fillText(itemSub, 60, y + 26);

    // QTY
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.font = font('normal', 18);
    ctx.fillText(`${item.quantity} ${item.product.unit || 'pcs'}`, 750, y + 10);

    // PRICE
    ctx.textAlign = 'right';
    ctx.fillText(formatCurrencyUsd(item.unitPrice), 940, y + 10);

    // AMOUNT
    ctx.fillText(formatCurrencyUsd(total), widthPx - 60, y + 10);

    y += 55;

    // Underline divider
    ctx.strokeStyle = borderGray;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.lineTo(widthPx - 60, y);
    ctx.stroke();

    y += 15;
  });

  y += 20;

  // --- Summary & QR Section ---
  const startSummaryY = y;

  // Payment QR Code logic (Left)
  try {
    const qrDataUrl = await QRCode.toDataURL(PAYMENT_QR_CODE_VALUE, {
      margin: 1,
      width: 220,
    });
    const img = new Image();
    img.src = qrDataUrl;
    await new Promise((res) => {
      img.onload = res;
    });

    const qrSize = 160;
    ctx.drawImage(img, 60, startSummaryY, qrSize, qrSize);

    ctx.fillStyle = secondaryColor;
    ctx.textAlign = 'left';
    ctx.font = font('bold', 15);
    ctx.fillText(
      'SCAN TO PAY / ស្កេនដើម្បីទូទាត់',
      60 + qrSize + 20,
      startSummaryY + qrSize / 2 - 10,
    );
  } catch (err) {
    console.error('Error drawing KHQR code on A4 invoice:', err);
  }

  // Summary Totals (Right)
  ctx.textAlign = 'right';

  if (receipt.subtotal !== receipt.total) {
    ctx.font = font('normal', 18);
    ctx.fillStyle = darkGray;
    ctx.fillText(
      `SUBTOTAL: ${formatCurrencyUsd(receipt.subtotal)}`,
      widthPx - 60,
      y,
    );
    y += 35;
  }

  ctx.fillStyle = secondaryColor;
  ctx.font = font('bold', 22);
  ctx.fillText('TOTAL:', widthPx - 300, y);
  ctx.font = font('bold', 32);
  ctx.fillStyle = primaryColor;
  ctx.fillText(formatCurrencyUsd(receipt.total), widthPx - 60, y - 6);
  y += 45;

  ctx.fillStyle = '#2563eb';
  ctx.font = font('bold', 22);
  ctx.fillText(`( ៛${formatCurrencyKhr(receipt.total)} )`, widthPx - 60, y);
  y += 40;

  ctx.font = font('normal', 18);
  ctx.fillStyle = darkGray;
  ctx.fillText(
    `PAID (${receipt.paymentMethod.toUpperCase()}): ${formatCurrencyUsd(receipt.amountPaid)}`,
    widthPx - 60,
    y,
  );
  y += 30;

  if (receipt.change > 0) {
    ctx.fillText(
      `CHANGE: ${formatCurrencyUsd(receipt.change)} (${formatCurrencyKhr(receipt.change)})`,
      widthPx - 60,
      y,
    );
  }

  // --- Footer ---
  const finalFooterY = heightPx - 110;

  ctx.strokeStyle = borderGray;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(60, finalFooterY);
  ctx.lineTo(widthPx - 60, finalFooterY);
  ctx.stroke();

  ctx.textAlign = 'right';
  ctx.fillStyle = secondaryColor;
  ctx.font = font('bold', 20);
  ctx.fillText('THANK YOU FOR YOUR BUSINESS!', widthPx - 60, finalFooterY + 25);

  ctx.fillStyle = darkGray;
  ctx.font = font('normal', 15);
  ctx.fillText(
    'Please keep this invoice for your records. / សូមរក្សាទុកវិក្កយបត្រនេះជាឯកសារ។',
    widthPx - 60,
    finalFooterY + 55,
  );

  // Export A4 PDF (Optimized to strictly guarantee file size < 1MB)
  let quality = 0.85;
  let imgData = canvas.toDataURL('image/jpeg', quality);
  let pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });
  pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  let pdfBlob = pdf.output('blob');

  // Safeguard: Ensure PDF size is strictly under 1MB (1,024,000 bytes)
  const MAX_SIZE_BYTES = 1024 * 1024; // 1 MB
  while (pdfBlob.size > MAX_SIZE_BYTES && quality > 0.3) {
    quality -= 0.15;
    imgData = canvas.toDataURL('image/jpeg', quality);
    pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    pdfBlob = pdf.output('blob');
  }

  return pdfBlob;
}
