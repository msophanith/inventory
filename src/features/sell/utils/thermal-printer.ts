import QRCode from 'qrcode';

import type { ReceiptData } from '../types/sell.types';
import { formatDateTime } from '../../../utils/date';
import { formatCurrencyKhr, formatCurrencyUsd } from '../../../utils/currency';
import { PAYMENT_QR_CODE_VALUE } from './pdf-generator';

export async function printThermalReceipt(receipt: ReceiptData) {
  try {
    const qrDataUrl = await QRCode.toDataURL(PAYMENT_QR_CODE_VALUE, {
      margin: 1,
      width: 120,
      errorCorrectionLevel: 'H',
    });

    return await new Promise<void>((resolve, reject) => {
      try {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        const contentWindow = iframe.contentWindow;
        if (!contentWindow) {
          throw new Error('Failed to create iframe for printing');
        }

        const doc = contentWindow.document;

        const itemsHtml = receipt.items
          .map(
            (item) => `
        <div class="item">
          <div class="item-name">${item.quantity}x ${item.product.name}</div>
          <div class="item-price">${formatCurrencyUsd(item.totalPrice)}</div>
        </div>
      `,
          )
          .join('');

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Receipt ${receipt.orderId}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&family=Suwannaphum:wght@400;700&display=swap');
            
            @page {
              margin: 0;
              size: 58mm auto;
            }
            
            body {
              width: 58mm;
              margin: 0;
              padding: 4mm;
              font-family: 'Inter', 'Suwannaphum', sans-serif;
              font-size: 12px;
              color: #000;
              background: #fff;
              box-sizing: border-box;
            }
            
            .header {
              text-align: center;
              margin-bottom: 4mm;
              padding-bottom: 2mm;
              border-bottom: 1px dashed #000;
            }
            
            .title {
              font-size: 16px;
              font-weight: 800;
              margin: 0 0 2mm 0;
            }
            
            .info {
              font-size: 10px;
              margin: 0;
              color: #333;
            }
            
            .item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 2mm;
              font-size: 11px;
            }
            
            .item-name {
              font-weight: 700;
              max-width: 40mm;
              word-wrap: break-word;
            }
            
            .item-price {
              font-weight: 800;
            }
            
            .divider {
              border-bottom: 1px dashed #000;
              margin: 3mm 0;
            }
            
            .totals {
              margin-top: 3mm;
            }
            
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 1.5mm;
              font-size: 11px;
            }
            
            .grand-total {
              font-size: 14px;
              font-weight: 800;
              margin-top: 2mm;
              padding-top: 2mm;
              border-top: 1px dashed #000;
            }
            
            .khr-total {
              font-size: 11px;
              text-align: right;
              font-weight: 700;
            }
            
            .footer {
              text-align: center;
              margin-top: 5mm;
              font-size: 10px;
              font-weight: 700;
            }
            
            .qr-code {
              display: block;
              margin: 3mm auto;
              width: 30mm;
              height: 30mm;
            }
            
            /* Hide print dialog header/footers when possible */
            @media print {
              html, body {
                width: 58mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">INVOICE</h1>
            <p class="info">Order #${receipt.orderId}</p>
            <p class="info">${formatDateTime(receipt.createdAt)}</p>
            <p class="info">Cashier: ${receipt.soldBy || 'Admin'}</p>
          </div>
          
          <div class="items">
            ${itemsHtml}
          </div>
          
          <div class="divider"></div>
          
          <div class="totals">
            ${
              receipt.discount > 0
                ? `
            <div class="total-row">
              <span>Discount</span>
              <span>-${formatCurrencyUsd(receipt.discount)}</span>
            </div>`
                : ''
            }
            
            <div class="total-row grand-total">
              <span>Total</span>
              <span>${formatCurrencyUsd(receipt.total)}</span>
            </div>
            <div class="khr-total">
              ${formatCurrencyKhr(receipt.total)}
            </div>
            
            <div class="divider"></div>
            
            <div class="total-row">
              <span>Paid (${receipt.paymentMethod})</span>
              <span>${formatCurrencyUsd(receipt.amountPaid)}</span>
            </div>
            <div class="total-row">
              <span>Change</span>
              <span>${formatCurrencyUsd(receipt.change)}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for your purchase!</p>
            <img class="qr-code" src="${qrDataUrl}" alt="Payment QR Code" />
            <p>Scan to Pay with KHQR</p>
          </div>
        </body>
        </html>
      `;

        doc.open();
        doc.write(htmlContent);
        doc.close();

        iframe.onload = () => {
          setTimeout(() => {
            contentWindow.focus();
            contentWindow.print();

            // Cleanup after printing dialog closes
            setTimeout(() => {
              document.body.removeChild(iframe);
              resolve();
            }, 1000);
          }, 250); // Small delay to ensure fonts load
        };
      } catch (error) {
        reject(error);
      }
    });
  } catch (error) {
    console.error('Error in thermal print:', error);
    throw error;
  }
}
