import type { Product } from '../../../services/product';

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit?: string;
}

export type PaymentMethod = 'CASH' | 'QR';

export interface ReceiptData {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  change: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  soldBy?: string;
}

export interface CheckoutFormValues {
  paymentMethod: PaymentMethod;
  amountPaid: number;
  note?: string;
}
