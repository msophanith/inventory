import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { movementService, telegramService } from '../../../services';
import type { CartItem, PaymentMethod, ReceiptData } from '../types/sell.types';

export function useCheckout() {
  const queryClient = useQueryClient();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const { mutateAsync: processCheckout, isPending } = useMutation({
    mutationFn: async ({
      items,
      subtotal,
      tax,
      discount,
      total,
      amountPaid,
      paymentMethod,
    }: {
      items: CartItem[];
      subtotal: number;
      tax: number;
      discount: number;
      total: number;
      amountPaid: number;
      paymentMethod: PaymentMethod;
    }) => {
      const orderId = `POS-${Date.now().toString().slice(-6)}`;

      for (const item of items) {
        await movementService.addMovement(
          {
            productId: item.product.id,
            type: 'OUT',
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            isDamaged: false,
            reference: `POS Sale #${orderId}`,
            note: `Payment via ${paymentMethod}`,
          },
          true,
        );

        const remainingQty = item.product.quantity - item.quantity;
        if (remainingQty <= (item.product.minStock || 0)) {
          try {
            await telegramService.sendLowStockAlert({
              ...item.product,
              quantity: Math.max(0, remainingQty),
            });
          } catch (err) {
            console.error('[useCheckout] Low stock alert failed:', err);
          }
        }
      }

      const receipt: ReceiptData = {
        orderId,
        items,
        subtotal,
        tax,
        discount,
        total,
        amountPaid,
        change: Math.max(0, amountPaid - total),
        paymentMethod,
        createdAt: new Date().toISOString(),
      };

      try {
        await telegramService.sendSaleNotification(receipt);
      } catch (err) {
        console.error('[useCheckout] Telegram notification failed:', err);
      }

      return receipt;
    },
    onSuccess: (receipt) => {
      setReceiptData(receipt);
      setIsCheckoutOpen(false);

      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      queryClient.invalidateQueries({ queryKey: ['productSummary'] });
      queryClient.invalidateQueries({ queryKey: ['movement'] });
      queryClient.invalidateQueries({ queryKey: ['today-sales'] });
      queryClient.invalidateQueries({ queryKey: ['report-movements'] });
      queryClient.invalidateQueries({ queryKey: ['low-stock-products'] });
      queryClient.invalidateQueries({ queryKey: ['out-of-stock-products'] });
    },
  });

  return {
    isCheckoutOpen,
    setIsCheckoutOpen,
    receiptData,
    setReceiptData,
    processCheckout,
    isPending,
  };
}
