import { AlertTriangle, Archive, Boxes, DollarSign } from 'lucide-react';

type ProductStatsProps = {
  totalItems: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
};

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);

const ProductInfo = ({
  totalItems,
  lowStock,
  outOfStock,
  totalValue,
}: ProductStatsProps) => {
  const cards = [
    {
      title: 'Total Products',
      value: totalItems.toLocaleString(),
      subtitle: 'Items in inventory',
      icon: Boxes,
      bg: 'from-blue-500 to-indigo-600',
      badge: 'Active',
      badgeColor: 'bg-white/20 text-white',
    },
    {
      title: 'Inventory Value',
      value: formatCurrency(totalValue),
      subtitle: 'Stock buy value',
      icon: DollarSign,
      bg: 'from-emerald-500 to-teal-600',
      badge: 'Assets',
      badgeColor: 'bg-white/20 text-white',
    },
    {
      title: 'Low Stock',
      value: lowStock,
      subtitle: 'Need restock',
      icon: AlertTriangle,
      bg: 'from-amber-500 to-orange-500',
      badge: lowStock > 0 ? 'Warning' : 'Good',
      badgeColor: 'bg-white/20 text-white',
    },
    {
      title: 'Out of Stock',
      value: outOfStock,
      subtitle: 'Unavailable items',
      icon: Archive,
      bg: 'from-red-500 to-rose-600',
      badge: outOfStock > 0 ? 'Critical' : 'Healthy',
      badgeColor:
        outOfStock > 0
          ? 'bg-red-200/20 text-red-100'
          : 'bg-emerald-200/20 text-emerald-100',
    },
  ];

  return (
    <div className='grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 xl:grid-cols-4'>
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br ${card.bg} p-3.5 sm:p-6 text-white shadow-md sm:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
          >
            {/* Background Decoration */}
            <div className='absolute -right-8 -top-8 h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-white/10 blur-xl' />
            <div className='absolute bottom-0 left-0 h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-black/10 blur-2xl' />

            <div className='relative flex items-start justify-between gap-2'>
              <div className='min-w-0 flex-1'>
                <p className='text-xs sm:text-sm font-medium text-white/80 truncate'>
                  {card.title}
                </p>

                <h2 className='mt-1.5 sm:mt-3 text-lg sm:text-3xl font-extrabold tracking-tight truncate'>
                  {card.value}
                </h2>

                <p className='mt-1 text-[11px] sm:text-xs text-white/75 truncate hidden sm:block'>
                  {card.subtitle}
                </p>
              </div>

              <div className='rounded-xl sm:rounded-2xl bg-white/20 p-2 sm:p-3 backdrop-blur-md shrink-0'>
                <Icon className='h-4 w-4 sm:h-6 sm:w-6' />
              </div>
            </div>

            <div className='relative mt-3 sm:mt-6 flex items-center justify-between'>
              <span
                className={`rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold ${card.badgeColor}`}
              >
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductInfo;
