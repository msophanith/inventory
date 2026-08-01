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

const TodaySaleCard = ({
  data,
  loading,
}: TodaySaleCardProps) => {
  if (loading) {
    return (
      <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 h-6 w-40 rounded bg-slate-200" />

        <div className="mb-6 h-12 w-52 rounded bg-slate-200" />

        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 rounded-2xl bg-slate-100" />
          <div className="h-24 rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Background */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-16 left-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

      <div className="relative">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-emerald-100">
              Today's Sales
            </p>

            <h2 className="mt-2 text-4xl font-bold tracking-tight">
              {formatCurrency(data?.totalSales ?? 0)}
            </h2>
          </div>

          <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
            <DollarSign size={34} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <div className="mb-3 flex items-center gap-2">
              <Receipt size={18} />
              <span className="text-sm text-emerald-100">
                Orders
              </span>
            </div>

            <p className="text-3xl font-bold">
              {data?.totalOrders ?? 0}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <div className="mb-3 flex items-center gap-2">
              <ShoppingCart size={18} />
              <span className="text-sm text-emerald-100">
                Items Sold
              </span>
            </div>

            <p className="text-3xl font-bold">
              {data?.totalItemsSold ?? 0}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
          <TrendingUp size={18} />
          <span className="text-sm">
            Live sales summary for today
          </span>
        </div>
      </div>
    </div>
  );
}

export { TodaySaleCard };