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

      // Submit a stock OUT movement for each item in the cart (skip individual alerts)
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

      // Send complete POS sale Telegram notification
      telegramService.sendSaleNotification(receipt);

      return receipt;
    },
    onSuccess: (receipt) => {
      setReceiptData(receipt);
      setIsCheckoutOpen(false);

      // Invalidate all product, movement, and sales queries for real-time update
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      queryClient.invalidateQueries({ queryKey: ['productSummary'] });
      queryClient.invalidateQueries({ queryKey: ['movement'] });
      queryClient.invalidateQueries({ queryKey: ['today-sales'] });
      queryClient.invalidateQueries({ queryKey: ['report-movements'] });
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
