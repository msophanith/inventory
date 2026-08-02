import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import type { ReceiptData } from '../types/sell.types';
import { formatDateTime } from '../../../utils/date';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';

export const PAYMENT_QR_CODE_VALUE =
  '00020101021129450016abaakhppxxx@abaa01090177373060208ABA Bank40600006abaP2P0112083EB929820E020901773730603090176336980404Dual5204000053031165802KH5908SILA SAO6010Phnom Penh630410DF';

export async function generatePdfInvoiceBlob(receipt: ReceiptData): Promise<Blob> {
  const widthPx = 576;
  const itemHeightPx = receipt.items.length * 36;
  const heightPx = Math.max(1200, 960 + itemHeightPx);

  const canvas = document.createElement('canvas');
  canvas.width = widthPx;
  canvas.height = heightPx;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not create canvas context for Khmer PDF invoice');
  }

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, widthPx, heightPx);

  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  let y = 30;

  // Header in Khmer & English
  ctx.font = 'bold 28px "Kantumruy Pro", "Battambang", "Khmer OS", sans-serif';
  ctx.fillText('ចម្ការដូងលក់គ្រឿងបន្លាស់រថយន្ត', widthPx / 2, y);
  y += 40;

  ctx.font = '20px "Kantumruy Pro", "Battambang", "Khmer OS", sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText('វិក្កយបត្រ / Sales Receipt & Tax Invoice', widthPx / 2, y);
  y += 45;

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(30, y);
  ctx.lineTo(widthPx - 30, y);
  ctx.stroke();
  y += 25;

  // Metadata
  ctx.textAlign = 'left';
  ctx.font = '18px "Kantumruy Pro", "Battambang", "Khmer OS", sans-serif';
  ctx.fillStyle = '#1e293b';
  ctx.fillText(`លេខវិក្កយបត្រ (Order ID): #${receipt.orderId}`, 30, y);
  y += 30;
  ctx.fillText(`កាលបរិច្ឆេទ (Date): ${formatDateTime(receipt.createdAt)}`, 30, y);
  y += 30;
  ctx.fillText(`វិធីសាស្ត្រទូទាត់ (Payment): ${receipt.paymentMethod.toUpperCase()}`, 30, y);
  y += 40;

  // Table Header
  ctx.beginPath();
  ctx.moveTo(30, y);
  ctx.lineTo(widthPx - 30, y);
  ctx.stroke();
  y += 15;

  ctx.font = 'bold 18px "Kantumruy Pro", "Battambang", "Khmer OS", sans-serif';
  ctx.fillText('មុខទំនិញ (Item)', 30, y);
  ctx.textAlign = 'right';
  ctx.fillText('ចំនួន', 360, y);
  ctx.fillText('តម្លៃ', 450, y);
  ctx.fillText('សរុប', widthPx - 30, y);
  y += 30;

  ctx.beginPath();
  ctx.moveTo(30, y);
  ctx.lineTo(widthPx - 30, y);
  ctx.stroke();
  y += 25;

  // Item Rows
  ctx.font = '18px "Kantumruy Pro", "Battambang", "Khmer OS", sans-serif';
  receipt.items.forEach((item) => {
    const itemTotal = item.quantity * item.unitPrice;
    ctx.textAlign = 'left';
    ctx.fillText(item.product.name, 30, y);

    ctx.textAlign = 'right';
    ctx.fillText(`${item.quantity}`, 360, y);
    ctx.fillText(`$${item.unitPrice.toFixed(2)}`, 450, y);
    ctx.fillText(`$${itemTotal.toFixed(2)}`, widthPx - 30, y);
    y += 35;
  });

  // Totals Section
  y += 10;
  ctx.beginPath();
  ctx.moveTo(30, y);
  ctx.lineTo(widthPx - 30, y);
  ctx.stroke();
  y += 30;

  ctx.textAlign = 'right';
  if (receipt.subtotal !== receipt.total) {
    ctx.fillText(`សរុបបឋម: ${formatCurrencyUsd(receipt.subtotal)}`, widthPx - 30, y);
    y += 35;
  }

  ctx.font = 'bold 22px "Kantumruy Pro", "Battambang", "Khmer OS", sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.fillText(`សរុបត្រូវបង់: ${formatCurrencyUsd(receipt.total)}`, widthPx - 30, y);
  y += 35;

  ctx.fillStyle = '#2563eb';
  ctx.fillText(`សរុបជាប្រាក់រៀល: ${formatCurrencyKhr(receipt.total)}`, widthPx - 30, y);
  y += 40;

  ctx.font = '18px "Kantumruy Pro", "Battambang", "Khmer OS", sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText(`ប្រាក់ទទួលបាន: ${formatCurrencyUsd(receipt.amountPaid)}`, widthPx - 30, y);
  y += 30;
  ctx.fillText(`ប្រាក់អាប់: ${formatCurrencyUsd(receipt.change)} (${formatCurrencyKhr(receipt.change)})`, widthPx - 30, y);
  y += 45;

  // KHQR Section
  try {
    const qrDataUrl = await QRCode.toDataURL(PAYMENT_QR_CODE_VALUE, { margin: 1, width: 200 });
    const img = new Image();
    img.src = qrDataUrl;
    await new Promise((res) => { img.onload = res; });

    ctx.textAlign = 'center';
    ctx.font = 'bold 18px "Kantumruy Pro", "Battambang", "Khmer OS", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('ស្កេនដើម្បីទូទាត់ (Scan to Pay KHQR)', widthPx / 2, y);
    y += 30;

    const qrSize = 180;
    ctx.drawImage(img, (widthPx - qrSize) / 2, y, qrSize, qrSize);
    y += qrSize + 30;
  } catch (err) {
    console.error('Error rendering KHQR on canvas:', err);
  }

  ctx.beginPath();
  ctx.moveTo(30, y);
  ctx.lineTo(widthPx - 30, y);
  ctx.stroke();
  y += 30;

  ctx.textAlign = 'center';
  ctx.font = 'italic 18px "Kantumruy Pro", "Battambang", "Khmer OS", sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('សូមអរគុណចំពោះការជាវទំនិញ! Thank you!', widthPx / 2, y);

  // Export to PDF
  const imgData = canvas.toDataURL('image/png');
  const mmWidth = 80;
  const mmHeight = (canvas.height * mmWidth) / canvas.width;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [mmWidth, mmHeight],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, mmWidth, mmHeight);
  return pdf.output('blob');
}
