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

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, widthPx, heightPx);
  ctx.textBaseline = 'top';

  const font = (weight = 'normal', size = 18) =>
    `${weight} ${size}px "Kantumruy Pro", "Battambang", "Khmer OS", sans-serif`;

  let y = 60;

  // Header Banner
  ctx.fillStyle = '#0f172a';
  ctx.font = font('bold', 32);
  ctx.fillText('ចម្ការដូងលក់គ្រឿងបន្លាស់រថយន្ត', 60, y);

  ctx.fillStyle = '#4f46e5';
  ctx.textAlign = 'right';
  ctx.font = font('bold', 28);
  ctx.fillText('វិក្កយបត្រ / TAX INVOICE', widthPx - 60, y);
  y += 50;

  ctx.fillStyle = '#64748b';
  ctx.textAlign = 'left';
  ctx.font = font('normal', 18);
  ctx.fillText('Chamkar Doung Auto Spare Parts Store', 60, y);
  y += 35;

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(60, y);
  ctx.lineTo(widthPx - 60, y);
  ctx.stroke();
  y += 30;

  // Invoice Details Grid
  ctx.fillStyle = '#1e293b';
  ctx.font = font('normal', 20);
  ctx.fillText(`លេខវិក្កយបត្រ (Invoice No): #${receipt.orderId}`, 60, y);
  ctx.textAlign = 'right';
  ctx.fillText(
    `កាលបរិច្ឆេទ (Date): ${formatDateTime(receipt.createdAt)}`,
    widthPx - 60,
    y,
  );
  y += 35;

  ctx.textAlign = 'left';
  ctx.fillText(
    `វិធីសាស្ត្រទូទាត់ (Payment): ${receipt.paymentMethod.toUpperCase()}`,
    60,
    y,
  );
  y += 45;

  // Table Header Box
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(60, y, widthPx - 120, 50);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(60, y, widthPx - 120, 50);

  ctx.fillStyle = '#0f172a';
  ctx.font = font('bold', 20);
  ctx.fillText('#', 80, y + 14);
  ctx.fillText('មុខទំនិញ (Description)', 140, y + 14);
  ctx.textAlign = 'right';
  ctx.fillText('ចំនួន (Qty)', 750, y + 14);
  ctx.fillText('តម្លៃរាយ (Price)', 940, y + 14);
  ctx.fillText('សរុប (Amount)', widthPx - 80, y + 14);
  y += 50;

  // Table Rows
  ctx.font = font('normal', 19);
  receipt.items.forEach((item, idx) => {
    const total = item.quantity * item.unitPrice;
    ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    ctx.fillRect(60, y, widthPx - 120, 48);

    ctx.fillStyle = '#334155';
    ctx.textAlign = 'left';
    ctx.fillText(`${idx + 1}`, 80, y + 13);
    ctx.fillText(item.product.name, 140, y + 13);

    ctx.textAlign = 'right';
    ctx.fillText(`${item.quantity}`, 750, y + 13);
    ctx.fillText(formatCurrencyUsd(item.unitPrice), 940, y + 13);
    ctx.fillText(formatCurrencyUsd(total), widthPx - 80, y + 13);

    ctx.strokeStyle = '#e2e8f0';
    ctx.strokeRect(60, y, widthPx - 120, 48);
    y += 48;
  });

  y += 30;

  // KHQR Payment Code Section (Left)
  try {
    const qrDataUrl = await QRCode.toDataURL(PAYMENT_QR_CODE_VALUE, {
      margin: 1,
      width: 250,
    });
    const img = new Image();
    img.src = qrDataUrl;
    await new Promise((res) => {
      img.onload = res;
    });

    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'left';
    ctx.font = font('bold', 20);
    ctx.fillText('ស្កេនដើម្បីទូទាត់ (Scan to Pay KHQR)', 60, y);
    ctx.drawImage(img, 60, y + 35, 200, 200);
  } catch (err) {
    console.error('Error drawing KHQR code on A4 invoice:', err);
  }

  // Summary Section (Right)
  ctx.textAlign = 'right';
  if (receipt.subtotal !== receipt.total) {
    ctx.font = font('normal', 20);
    ctx.fillStyle = '#475569';
    ctx.fillText(
      `សរុបបឋម (Subtotal): ${formatCurrencyUsd(receipt.subtotal)}`,
      widthPx - 60,
      y,
    );
    y += 40;
  }

  ctx.font = font('bold', 26);
  ctx.fillStyle = '#0f172a';
  ctx.fillText(
    `សរុបត្រូវបង់: ${formatCurrencyUsd(receipt.total)}`,
    widthPx - 60,
    y,
  );
  y += 45;

  ctx.fillStyle = '#2563eb';
  ctx.fillText(
    `សរុបជាប្រាក់រៀល: ${formatCurrencyKhr(receipt.total)}`,
    widthPx - 60,
    y,
  );
  y += 45;

  ctx.font = font('normal', 20);
  ctx.fillStyle = '#475569';
  ctx.fillText(
    `ប្រាក់ទទួលបាន (Paid): ${formatCurrencyUsd(receipt.amountPaid)}`,
    widthPx - 60,
    y,
  );
  y += 35;
  ctx.fillText(
    `ប្រាក់អាប់ (Change): ${formatCurrencyUsd(receipt.change)} (${formatCurrencyKhr(receipt.change)})`,
    widthPx - 60,
    y,
  );

  // Footer Message
  y = heightPx - 100;
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(60, y);
  ctx.lineTo(widthPx - 60, y);
  ctx.stroke();
  y += 30;

  ctx.textAlign = 'center';
  ctx.font = font('italic', 20);
  ctx.fillStyle = '#64748b';
  ctx.fillText(
    'សូមអរគុណចំពោះការជាវទំនិញ! Thank you for your business!',
    widthPx / 2,
    y,
  );

  // Export A4 PDF
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
  return pdf.output('blob');
}
