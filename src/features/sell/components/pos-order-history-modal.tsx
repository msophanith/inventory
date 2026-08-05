import { useState, useMemo } from 'react';
import { History, Search, X } from 'lucide-react';
import type { Movement } from '../../../services/movement';
import type { ReceiptData } from '../types/sell.types';
import { formatDate } from '../../../utils/date';
import { generatePdfInvoiceBlob } from '../utils/pdf-generator';
import { PosOrderHistoryMonthGroup } from './pos-order-history-month-group';

interface Props {
  readonly open: boolean;
  readonly movements: Movement[];
  readonly onClose: () => void;
  readonly onOpenReceipt: (receipt: ReceiptData) => void;
}

export function PosOrderHistoryModal({
  open,
  movements,
  onClose,
  onOpenReceipt,
}: Props) {
  const [search, setSearch] = useState('');

  const saleMovements = useMemo(() => {
    return movements.filter(
      (m) =>
        m.type === 'OUT' &&
        !m.isDamaged &&
        (!search ||
          m.id.toLowerCase().includes(search.toLowerCase()) ||
          m.product?.name.toLowerCase().includes(search.toLowerCase())),
    );
  }, [movements, search]);

  const groupedMovements = useMemo(() => {
    const groupMap = new Map<string, Movement[]>();
    for (const m of saleMovements) {
      const monthKey = formatDate(m.createdAt, 'MMMM yyyy');
      const existing = groupMap.get(monthKey);
      if (existing) {
        existing.push(m);
      } else {
        groupMap.set(monthKey, [m]);
      }
    }
    return Array.from(groupMap.entries()).map(([month, items]) => ({
      month,
      items,
    }));
  }, [saleMovements]);

  if (!open) return null;

  const handleRePrint = async (item: Movement) => {
    const totalAmount = item.quantity * (item.unitPrice || 0);
    const receiptData: ReceiptData = {
      orderId: item.id.slice(0, 8).toUpperCase(),
      items: [
        {
          product: item.product || {
            id: item.productId, name: 'Item', sellPrice: item.unitPrice || 0,
            buyPrice: 0, quantity: 0, minStock: 0, barcode: '', category: '',
            createdAt: '', updatedAt: '', unit: 'pcs',
          },
          quantity: item.quantity,
          unitPrice: item.unitPrice || 0,
          totalPrice: totalAmount,
        },
      ],
      subtotal: totalAmount,
      tax: 0,
      discount: 0,
      total: totalAmount,
      amountPaid: totalAmount,
      change: 0,
      paymentMethod: (item.reference?.toUpperCase() as any) || 'CASH',
      createdAt: typeof item.createdAt === 'string' ? item.createdAt : (item.createdAt?.toISOString() ?? new Date().toISOString()),
    };

    onOpenReceipt(receiptData);

    try {
      const blob = await generatePdfInvoiceBlob(receiptData);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Tax_Invoice_${receiptData.orderId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Invoice blob generation error:', err);
    }
  };

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200'>
      <div className='w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200'>
        <div className='flex items-center justify-between border-b border-slate-100 pb-3'>
          <div className='flex items-center gap-2 text-slate-900'>
            <History size={20} className='text-indigo-600' />
            <h3 className='text-lg font-extrabold'>Receipt & Invoice History</h3>
          </div>
          <button
            onClick={onClose}
            className='rounded-xl p-1 text-slate-400 hover:bg-slate-100 transition cursor-pointer'
          >
            <X size={20} />
          </button>
        </div>

        <div className='relative'>
          <Search
            size={17}
            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
          />
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search receipt by Order ID or Product Name...'
            className='w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none'
          />
        </div>

        <div className='space-y-3 max-h-[420px] overflow-y-auto pr-1'>
          {groupedMovements.length === 0 ? (
            <p className='p-8 text-center text-xs text-slate-400 font-semibold'>
              No receipts found.
            </p>
          ) : (
            groupedMovements.map(({ month, items }, index) => (
              <PosOrderHistoryMonthGroup
                key={month}
                month={month}
                items={items}
                defaultOpen={index === 0}
                onRePrint={handleRePrint}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
