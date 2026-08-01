import { DollarSign, Receipt, ShoppingCart, TrendingUp } from 'lucide-react';
import type { TodaySaleSummary } from '../../../services/movement';

interface TodaySaleCardProps {
  data?: TodaySaleSummary;
  loading?: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

const TodaySaleCard = ({ data, loading }: TodaySaleCardProps) => {
  if (loading) {
    return (
      <div className='animate-pulse rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-4'>
        <div className='h-6 w-36 rounded bg-slate-200' />
        <div className='h-10 w-48 rounded bg-slate-200' />
        <div className='grid grid-cols-2 gap-3 sm:gap-4'>
          <div className='h-20 sm:h-24 rounded-2xl bg-slate-100' />
          <div className='h-20 sm:h-24 rounded-2xl bg-slate-100' />
        </div>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-4 sm:p-6 text-white shadow-lg sm:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'>
      {/* Background */}
      <div className='absolute -right-10 -top-10 h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-white/10 blur-3xl' />
      <div className='absolute -bottom-16 left-0 h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-white/10 blur-2xl' />

      <div className='relative space-y-4 sm:space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-xs sm:text-sm font-medium text-emerald-100'>
              Today's Revenue & Sales
            </p>

            <h2 className='mt-1 sm:mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight truncate'>
              {formatCurrency(data?.totalSales ?? 0)}
            </h2>
          </div>

          <div className='rounded-xl sm:rounded-2xl bg-white/15 p-3 sm:p-4 backdrop-blur shrink-0'>
            <DollarSign className='h-6 w-6 sm:h-8 sm:w-8' />
          </div>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-2 gap-3 sm:gap-4'>
          <div className='rounded-xl sm:rounded-2xl bg-white/10 p-3 sm:p-4 backdrop-blur'>
            <div className='mb-1.5 sm:mb-3 flex items-center gap-1.5 sm:gap-2'>
              <Receipt size={16} className='text-emerald-200' />
              <span className='text-xs sm:text-sm font-medium text-emerald-100'>
                Orders
              </span>
            </div>

            <p className='text-xl sm:text-3xl font-extrabold'>
              {data?.totalOrders ?? 0}
            </p>
          </div>

          <div className='rounded-xl sm:rounded-2xl bg-white/10 p-3 sm:p-4 backdrop-blur'>
            <div className='mb-1.5 sm:mb-3 flex items-center gap-1.5 sm:gap-2'>
              <ShoppingCart size={16} className='text-emerald-200' />
              <span className='text-xs sm:text-sm font-medium text-emerald-100'>
                Items Sold
              </span>
            </div>

            <p className='text-xl sm:text-3xl font-extrabold'>
              {data?.totalItemsSold ?? 0}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center gap-2 rounded-xl sm:rounded-2xl bg-white/10 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium backdrop-blur'>
          <TrendingUp size={16} />
          <span>Real-time sales summary for today</span>
        </div>
      </div>
    </div>
  );
};

export { TodaySaleCard };