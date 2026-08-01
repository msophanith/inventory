import { AlertTriangle, Archive, Boxes, DollarSign } from 'lucide-react';

type ProductStatsProps = {
  totalItems: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
};

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
      subtitle: 'Products in inventory',
      icon: Boxes,
      bg: 'from-blue-500 to-indigo-600',
      // badge: '+12%',
      badgeColor: 'bg-green-500/20 text-green-100',
    },
    {
      title: 'Inventory Value',
      value: `$${totalValue.toLocaleString()}`,
      subtitle: 'Current stock value',
      icon: DollarSign,
      bg: 'from-emerald-500 to-green-600',
      // badge: '+8%',
      badgeColor: 'bg-white/20 text-white',
    },
    {
      title: 'Low Stock',
      value: lowStock,
      subtitle: 'Need restocking',
      icon: AlertTriangle,
      bg: 'from-amber-500 to-orange-500',
      badge: 'Alert',
      badgeColor: 'bg-white/20 text-white',
    },
    {
      title: 'Out of Stock',
      value: outOfStock,
      subtitle: 'Unavailable products',
      icon: Archive,
      bg: 'from-red-500 to-rose-600',
      badge: outOfStock > 0 ? 'Critical' : 'Healthy',
      badgeColor:
        outOfStock > 0
          ? 'bg-red-200/20 text-red-100`'
          : 'bg-green-200/20 text-green-100',
    },
  ];

  return (
    <div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-4'>
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`relative overflow-hidden rounded-3xl bg-linear-to-br ${card.bg} p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
          >
            {/* Background Decoration */}
            <div className='absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-xl' />
            <div className='absolute bottom-0 left-0 h-20 w-20 rounded-full bg-black/10 blur-2xl' />

            <div className='relative flex items-start justify-between'>
              <div>
                <p className='text-sm font-medium text-white/80'>
                  {card.title}
                </p>

                <h2 className='mt-3 text-4xl font-bold tracking-tight'>
                  {card.value}
                </h2>

                <p className='mt-2 text-sm text-white/75'>{card.subtitle}</p>
              </div>

              <div className='rounded-2xl bg-white/20 p-3 backdrop-blur-md'>
                <Icon className='h-7 w-7' />
              </div>
            </div>

            <div className='relative mt-8 flex items-center justify-between'>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${card.badgeColor}`}
              >
                {card.badge}
              </span>

              {/* <div className='flex items-center gap-1 text-sm'>
                <TrendingUp size={16} />
                <span>This month</span>
              </div> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductInfo;
