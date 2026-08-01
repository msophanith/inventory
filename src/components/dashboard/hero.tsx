import { CalendarDays } from 'lucide-react';

export default function Hero() {
  const now = new Date();

  const greeting =
    now.getHours() < 12
      ? 'Good Morning'
      : now.getHours() < 18
        ? 'Good Afternoon'
        : 'Good Evening';

  return (
    <section className='relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-6 sm:p-10 text-white shadow-lg sm:shadow-xl'>
      <div className='absolute -right-10 -top-10 h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-white/10 blur-2xl' />
      <div className='absolute -bottom-10 left-0 h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-white/10 blur-2xl' />

      <div className='relative z-10 space-y-3 sm:space-y-4'>
        <p className='text-sm sm:text-lg font-medium opacity-80'>{greeting} 👋</p>

        <h1 className='text-3xl sm:text-5xl font-black tracking-tight leading-tight'>
          Track. Manage. Grow.
        </h1>

        <p className='max-w-lg text-xs sm:text-sm text-indigo-100 leading-relaxed font-medium'>
          Everything you need to manage your inventory, monitor sales, and control stock in one place.
        </p>

        <div className='pt-2 flex items-center gap-2 text-xs sm:text-sm text-indigo-100 font-semibold'>
          <CalendarDays size={16} />
          <span>{now.toDateString()}</span>
        </div>
      </div>
    </section>
  );
}
